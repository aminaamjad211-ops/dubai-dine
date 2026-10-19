import express, { Request, Response } from 'express';
import { Restaurant, VisitorCorrection } from '../src/types/restaurant';
import { calculateDubaiLiveStatus, getDubaiTimeParts } from '../src/utils/dubaiTime';
import {
  DUBAI_NEIGHBOURHOOD_BBOXES,
  fetchAndImportOverpassDubai,
  importCsv,
  importGeoJson,
  importOsmDubaiDataset,
} from './importers/dataImporter';
import {
  createOrUpdateRestaurant,
  deleteRestaurant,
  getBaselineDataset,
  getRestaurantBySlug,
  listBackups,
  loadCorrections,
  loadRestaurants,
  restoreBackupFile,
  saveCorrections,
  saveRestaurants,
} from './storage';

export const apiRouter = express.Router();

// Allow larger body payloads for GeoJSON/CSV imports (up to 10MB)
apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.text({ type: ['text/csv', 'application/geo+json'], limit: '10mb' }));

// 1. Dubai Server-Authoritative Time
apiRouter.get('/dubai-time', (_req: Request, res: Response) => {
  const parts = getDubaiTimeParts();
  res.json({
    timeZone: 'Asia/Dubai',
    iso: new Date().toISOString(),
    parts,
  });
});

// 2. Restaurants List with Database-backed Pagination, Filters & Metadata
apiRouter.get('/restaurants', (req: Request, res: Response) => {
  try {
    let allRestaurants = loadRestaurants();
    const {
      q,
      neighborhood,
      cuisine,
      category,
      priceTier,
      amenity,
      openNow,
      verifiedOnly,
      featured,
      reviewStatus = 'approved', // Default only approved listings to public
      page = '1',
      limit = '12',
      all = 'false',
    } = req.query;

    // Filter by Review Status (public sees approved; admin can see pending_review/all)
    if (reviewStatus !== 'all') {
      allRestaurants = allRestaurants.filter((r) => (r.reviewStatus || 'approved') === reviewStatus);
    }

    // Text Search
    if (q && typeof q === 'string') {
      const term = q.toLowerCase().trim();
      allRestaurants = allRestaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.cuisine.some((c) => c.toLowerCase().includes(term)) ||
          r.neighborhood.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.address.formattedAddress.toLowerCase().includes(term)
      );
    }

    // Neighborhood Filter
    if (neighborhood && typeof neighborhood === 'string' && neighborhood !== 'all') {
      allRestaurants = allRestaurants.filter((r) => r.neighborhood.toLowerCase().includes(neighborhood.toLowerCase()));
    }

    // Cuisine Filter
    if (cuisine && typeof cuisine === 'string' && cuisine !== 'all') {
      allRestaurants = allRestaurants.filter((r) => r.cuisine.some((c) => c.toLowerCase() === cuisine.toLowerCase()));
    }

    // Category Filter (restaurant, cafe, fast_food, bistro, bakery)
    if (category && typeof category === 'string' && category !== 'all') {
      allRestaurants = allRestaurants.filter((r) => (r.category || 'restaurant') === category);
    }

    // Price Tier Filter
    if (priceTier && typeof priceTier === 'string' && priceTier !== 'all') {
      allRestaurants = allRestaurants.filter((r) => r.priceTier === priceTier);
    }

    // Amenity Filter
    if (amenity && typeof amenity === 'string' && amenity !== 'all') {
      allRestaurants = allRestaurants.filter((r) =>
        (r.amenities || []).some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
      );
    }

    // Verified Status Filter
    if (verifiedOnly === 'true') {
      allRestaurants = allRestaurants.filter((r) => r.verification.status === 'verified');
    }

    // Featured Filter
    if (featured === 'true') {
      allRestaurants = allRestaurants.filter((r) => r.featured);
    }

    // Enrich with computed live status in Dubai timezone
    const referenceDate = new Date();
    const enriched = allRestaurants.map((r) => {
      const liveStatus = calculateDubaiLiveStatus(r, referenceDate);
      return {
        ...r,
        liveStatus,
      };
    });

    // Open Now Filter
    let filteredResults = enriched;
    if (openNow === 'true') {
      filteredResults = enriched.filter((r) => r.liveStatus.isOpen);
    }

    // Total Count
    const totalRecords = filteredResults.length;

    // Overall Database Metrics Summary
    const rawAll = loadRestaurants();
    const summary = {
      totalRecords: rawAll.length,
      uniqueVenues: new Set(rawAll.map((r) => r.name.toLowerCase().trim())).size,
      approvedCount: rawAll.filter((r) => (r.reviewStatus || 'approved') === 'approved').length,
      pendingReviewCount: rawAll.filter((r) => r.reviewStatus === 'pending_review').length,
      flaggedCount: rawAll.filter((r) => r.reviewStatus === 'flagged' || (r.flagReasons && r.flagReasons.length > 0)).length,
      verifiedHoursCount: rawAll.filter(
        (r) => r.verification.status === 'verified' && r.operatingHours.schedule.length > 0
      ).length,
      verifiedCoordinatesCount: rawAll.filter((r) => r.coordinates.isExact).length,
      osmImportedCount: rawAll.filter((r) => r.sourceType === 'openstreetmap').length,
      editorialCount: rawAll.filter((r) => r.sourceType === 'editorial_verified' || !r.sourceType).length,
    };

    // If client requested unpaginated data
    if (all === 'true') {
      res.json({
        data: filteredResults,
        pagination: {
          page: 1,
          limit: totalRecords,
          totalRecords,
          totalPages: 1,
          hasMore: false,
        },
        summary,
      });
      return;
    }

    // Database-backed pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 12));
    const totalPages = Math.ceil(totalRecords / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedData = filteredResults.slice(startIndex, startIndex + limitNum);

    res.json({
      data: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalRecords,
        totalPages,
        hasMore: pageNum < totalPages,
      },
      summary,
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to retrieve restaurant directory' });
  }
});

// 3. Single Restaurant Detail by Slug
apiRouter.get('/restaurants/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const restaurant = getRestaurantBySlug(slug);

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant not found in registry' });
      return;
    }

    const liveStatus = calculateDubaiLiveStatus(restaurant, new Date());
    res.json({
      ...restaurant,
      liveStatus,
    });
  } catch (error) {
    console.error('Error fetching restaurant details:', error);
    res.status(500).json({ error: 'Failed to retrieve restaurant details' });
  }
});

// 4. Visitor Submitted Corrections
apiRouter.post('/corrections', (req: Request, res: Response) => {
  try {
    const { restaurantId, restaurantName, field, reportedValue, sourceEvidence, contactEmail } = req.body;

    if (!restaurantId || !reportedValue || !sourceEvidence) {
      res.status(400).json({
        error: 'Missing required correction fields. Restaurant ID, reported value, and source evidence are required.',
      });
      return;
    }

    const corrections = loadCorrections();
    const newCorrection: VisitorCorrection = {
      id: `corr-${Date.now()}`,
      restaurantId: String(restaurantId),
      restaurantName: restaurantName ? String(restaurantName) : 'Unknown Venue',
      field: field || 'operating_hours',
      reportedValue: String(reportedValue).trim(),
      sourceEvidence: String(sourceEvidence).trim(),
      contactEmail: contactEmail ? String(contactEmail).trim() : undefined,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };

    corrections.unshift(newCorrection);
    saveCorrections(corrections);

    res.status(201).json({
      message: 'Correction submitted successfully for editorial review.',
      correction: newCorrection,
    });
  } catch (error) {
    console.error('Error submitting correction:', error);
    res.status(500).json({ error: 'Failed to submit correction' });
  }
});

// 5. Admin: List All Corrections
apiRouter.get('/admin/corrections', (_req: Request, res: Response) => {
  try {
    const corrections = loadCorrections();
    res.json(corrections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load corrections' });
  }
});

// 6. Admin: Update Correction Status
apiRouter.patch('/admin/corrections/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const corrections = loadCorrections();
    const idx = corrections.findIndex((c) => c.id === id);

    if (idx === -1) {
      res.status(404).json({ error: 'Correction ticket not found' });
      return;
    }

    corrections[idx].status = status;
    corrections[idx].reviewedAt = new Date().toISOString();
    if (adminNotes !== undefined) {
      corrections[idx].adminNotes = adminNotes;
    }

    saveCorrections(corrections);
    res.json(corrections[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update correction' });
  }
});

// 7. Admin: Bulk Import GeoJSON
apiRouter.post('/admin/import/geojson', (req: Request, res: Response) => {
  try {
    const geoJsonContent = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const currentList = loadRestaurants();
    const { summary, updatedList } = importGeoJson(geoJsonContent, currentList);

    if (summary.importedCount > 0) {
      saveRestaurants(updatedList);
    }

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: `Import failed: ${error.message}` });
  }
});

// 8. Admin: Bulk Import CSV
apiRouter.post('/admin/import/csv', (req: Request, res: Response) => {
  try {
    const csvContent = typeof req.body === 'string' ? req.body : req.body.csv;
    if (!csvContent) {
      res.status(400).json({ error: 'CSV string content is required' });
      return;
    }

    const currentList = loadRestaurants();
    const { summary, updatedList } = importCsv(csvContent, currentList);

    if (summary.importedCount > 0) {
      saveRestaurants(updatedList);
    }

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: `CSV Import failed: ${error.message}` });
  }
});

// 9. Admin: Import OpenStreetMap Curated Dubai Dataset
apiRouter.post('/admin/import/osm-dataset', (_req: Request, res: Response) => {
  try {
    const currentList = loadRestaurants();
    const { summary, updatedList } = importOsmDubaiDataset(currentList);

    if (summary.importedCount > 0) {
      saveRestaurants(updatedList);
    }

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: `OSM Import failed: ${error.message}` });
  }
});

// 9b. Admin: Overpass API Areas and Live Query
apiRouter.get('/admin/import/overpass-areas', (_req: Request, res: Response) => {
  res.json(DUBAI_NEIGHBOURHOOD_BBOXES);
});

apiRouter.post('/admin/import/overpass', async (req: Request, res: Response) => {
  try {
    const { areaKey = 'downtown' } = req.body;
    const currentList = loadRestaurants();
    const { summary, updatedList } = await fetchAndImportOverpassDubai(areaKey, currentList);

    if (summary.importedCount > 0) {
      saveRestaurants(updatedList);
    }

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: `Overpass live fetch failed: ${error.message}` });
  }
});

// 10. Admin: Backups Management
apiRouter.get('/admin/backups', (_req: Request, res: Response) => {
  try {
    const backups = listBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

apiRouter.post('/admin/backups/restore', (req: Request, res: Response) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      res.status(400).json({ error: 'Backup filename is required' });
      return;
    }
    const ok = restoreBackupFile(filename);
    if (!ok) {
      res.status(404).json({ error: 'Backup file could not be read or restored' });
      return;
    }
    const count = loadRestaurants().length;
    res.json({ message: `Restored successfully from ${filename}`, count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Admin: Review Status (Approve / Reject / Flag)
apiRouter.patch('/admin/restaurants/:id/review', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewStatus, notes } = req.body;
    const list = loadRestaurants();
    const idx = list.findIndex((r) => r.id === id || r.slug === id);

    if (idx === -1) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    list[idx].reviewStatus = reviewStatus;
    if (notes) {
      list[idx].verification.editorialNotes = `${list[idx].verification.editorialNotes} [Admin Note: ${notes}]`;
    }

    saveRestaurants(list);
    res.json(list[idx]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Admin: Bulk Actions
apiRouter.post('/admin/restaurants/bulk-action', (req: Request, res: Response) => {
  try {
    const { action, ids } = req.body;
    if (!action || !Array.isArray(ids)) {
      res.status(400).json({ error: 'Action and array of restaurant IDs required' });
      return;
    }

    let list = loadRestaurants();
    if (action === 'approve') {
      list = list.map((r) => (ids.includes(r.id) ? { ...r, reviewStatus: 'approved' as const } : r));
    } else if (action === 'flag') {
      list = list.map((r) => (ids.includes(r.id) ? { ...r, reviewStatus: 'flagged' as const } : r));
    } else if (action === 'delete') {
      list = list.filter((r) => !ids.includes(r.id));
    }

    saveRestaurants(list);
    res.json({ success: true, count: ids.length, remaining: list.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 13. Admin: Create or Update Single Restaurant
apiRouter.post('/admin/restaurants', (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.slug) {
      res.status(400).json({ error: 'Name and slug are required fields' });
      return;
    }

    const saved = createOrUpdateRestaurant(data);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Admin create restaurant error:', error);
    res.status(500).json({ error: 'Failed to create restaurant listing' });
  }
});

apiRouter.put('/admin/restaurants/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body, id };
    const saved = createOrUpdateRestaurant(data);
    res.json(saved);
  } catch (error) {
    console.error('Admin update restaurant error:', error);
    res.status(500).json({ error: 'Failed to update restaurant listing' });
  }
});

// 14. Admin: Delete Single Restaurant
apiRouter.delete('/admin/restaurants/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = deleteRestaurant(id);
    if (!ok) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.json({ message: 'Restaurant listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
});

// 15. Admin: Re-verify Single Restaurant
apiRouter.post('/admin/restaurants/:id/verify', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verifiedBy, primarySource, primarySourceUrl, editorialNotes } = req.body;
    const list = loadRestaurants();
    const idx = list.findIndex((r) => r.id === id || r.slug === id);

    if (idx === -1) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const nowIso = new Date().toISOString();
    list[idx].verification = {
      ...list[idx].verification,
      status: 'verified',
      verifiedAt: nowIso,
      lastCheckedAt: nowIso,
      verifiedBy: verifiedBy || 'DineDubai Chief Editor',
      primarySource: primarySource || list[idx].verification.primarySource,
      primarySourceUrl: primarySourceUrl || list[idx].verification.primarySourceUrl,
      editorialNotes: editorialNotes || list[idx].verification.editorialNotes,
      verifiedFields: ['name', 'address', 'coordinates', 'hours', 'phone', 'price', 'cuisine'],
    };
    list[idx].reviewStatus = 'approved';
    list[idx].googleMaps.verifiedLocation = true;

    saveRestaurants(list);
    res.json(list[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify restaurant' });
  }
});

// 16. Admin: Reset to Full Baseline Dataset (36+ authentic Dubai venues)
apiRouter.post('/admin/seed-reset', (_req: Request, res: Response) => {
  try {
    const baseline = getBaselineDataset();
    saveRestaurants(baseline);
    res.json({ message: 'Database reset to authentic Dubai baseline (36+ venues)', count: baseline.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset seed data' });
  }
});
