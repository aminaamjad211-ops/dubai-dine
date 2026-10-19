import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  MapPin,
  Save,
  X,
  Upload,
  Database,
  FileText,
  Globe2,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  History,
} from 'lucide-react';
import { Restaurant, VisitorCorrection } from '../../types/restaurant';
import { isValidGoogleMapsUrl } from '../../utils/googleMapsUrl';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  onRefresh: () => void;
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ restaurants, onRefresh, onExit }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'import_center' | 'corrections' | 'maps_bridge'>('listings');
  const [corrections, setCorrections] = useState<VisitorCorrection[]>([]);
  const [backups, setBackups] = useState<string[]>([]);
  const [isLoadingCorrections, setIsLoadingCorrections] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterReviewStatus, setFilterReviewStatus] = useState<string>('all');

  // Import Center State
  const [geoJsonInput, setGeoJsonInput] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [selectedOverpassArea, setSelectedOverpassArea] = useState<string>('downtown');
  const [isOverpassLoading, setIsOverpassLoading] = useState(false);
  const [importSummary, setImportSummary] = useState<any | null>(null);

  // Load corrections & backups
  useEffect(() => {
    fetchCorrections();
    fetchBackups();
  }, []);

  const fetchCorrections = async () => {
    setIsLoadingCorrections(true);
    try {
      const res = await fetch('/api/admin/corrections');
      if (res.ok) {
        const data = await res.json();
        setCorrections(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCorrections(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await fetch('/api/admin/backups');
      if (res.ok) {
        const data = await res.json();
        setBackups(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReverify = async (restaurant: Restaurant) => {
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurant.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verifiedBy: 'DineDubai Chief Editor (Admin Verified)',
          primarySource: restaurant.verification.primarySource,
          editorialNotes: `Routine editorial audit performed. Hours and coordinates confirmed with official municipality records.`,
        }),
      });
      if (res.ok) {
        setStatusMessage(`Successfully verified ${restaurant.name} and updated timestamp!`);
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the directory?`)) return;
    try {
      const res = await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage(`Deleted "${name}".`);
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'flag' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected listings?`)) return;

    try {
      const res = await fetch('/api/admin/restaurants/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (res.ok) {
        setStatusMessage(`Bulk ${action} applied to ${selectedIds.length} listings.`);
        setSelectedIds([]);
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFetchOverpass = async () => {
    setIsOverpassLoading(true);
    setImportSummary(null);
    try {
      const res = await fetch('/api/admin/import/overpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areaKey: selectedOverpassArea }),
      });
      const data = await res.json();
      setImportSummary(data);
      if (data.errors && data.errors.length > 0 && data.importedCount === 0) {
        setStatusMessage(`Overpass Notice: ${data.errors[0]}`);
      } else {
        setStatusMessage(
          `Overpass Import: ${data.importedCount} venues imported, ${data.duplicateCount} duplicates skipped.`
        );
      }
      setTimeout(() => setStatusMessage(null), 5000);
      onRefresh();
      fetchBackups();
    } catch (e: any) {
      alert(`Overpass live query error: ${e.message}`);
    } finally {
      setIsOverpassLoading(false);
    }
  };

  const handleImportOsmCurated = async () => {
    setIsImporting(true);
    setImportSummary(null);
    try {
      const res = await fetch('/api/admin/import/osm-dataset', { method: 'POST' });
      const data = await res.json();
      setImportSummary(data);
      setStatusMessage(`Import complete! Added ${data.importedCount} new venues, ${data.duplicateCount} duplicates skipped.`);
      setTimeout(() => setStatusMessage(null), 4000);
      onRefresh();
      fetchBackups();
    } catch (e: any) {
      alert(`Import error: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportGeoJson = async () => {
    if (!geoJsonInput.trim()) {
      alert('Please paste valid GeoJSON FeatureCollection text');
      return;
    }
    setIsImporting(true);
    setImportSummary(null);
    try {
      const res = await fetch('/api/admin/import/geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: geoJsonInput,
      });
      const data = await res.json();
      setImportSummary(data);
      setStatusMessage(`GeoJSON Import: ${data.importedCount} imported, ${data.duplicateCount} duplicates skipped.`);
      onRefresh();
      fetchBackups();
    } catch (e: any) {
      alert(`GeoJSON Import error: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportCsv = async () => {
    if (!csvInput.trim()) {
      alert('Please paste valid CSV content');
      return;
    }
    setIsImporting(true);
    setImportSummary(null);
    try {
      const res = await fetch('/api/admin/import/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv' },
        body: csvInput,
      });
      const data = await res.json();
      setImportSummary(data);
      setStatusMessage(`CSV Import: ${data.importedCount} imported, ${data.duplicateCount} duplicates skipped.`);
      onRefresh();
      fetchBackups();
    } catch (e: any) {
      alert(`CSV Import error: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!window.confirm(`Restore database from snapshot "${filename}"? Current state will be replaced.`)) return;
    try {
      const res = await fetch('/api/admin/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatusMessage(`Restored successfully. Now viewing ${data.count} listings.`);
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCorrectionStatus = async (
    id: string,
    status: VisitorCorrection['status'],
    adminNotes?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/corrections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        fetchCorrections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveRestaurant = async (data: Restaurant) => {
    try {
      const method = isAddingNew ? 'POST' : 'PUT';
      const endpoint = isAddingNew ? '/api/admin/restaurants' : `/api/admin/restaurants/${data.id}`;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatusMessage(`Listing "${data.name}" saved successfully!`);
        setEditingRestaurant(null);
        setIsAddingNew(false);
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetToBaseline = async () => {
    if (!window.confirm('Reset all restaurants to the authentic Dubai baseline dataset (36+ venues)?')) return;
    try {
      const res = await fetch('/api/admin/seed-reset', { method: 'POST' });
      if (res.ok) {
        setStatusMessage('Directory successfully restored to authentic baseline.');
        setTimeout(() => setStatusMessage(null), 3000);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Metrics calculation
  const totalCount = restaurants.length;
  const uniqueCount = new Set(restaurants.map((r) => r.name.toLowerCase().trim())).size;
  const approvedCount = restaurants.filter((r) => (r.reviewStatus || 'approved') === 'approved').length;
  const verifiedHoursCount = restaurants.filter(
    (r) => r.verification.status === 'verified' && r.operatingHours.schedule && r.operatingHours.schedule.length > 0
  ).length;
  const exactCoordinatesCount = restaurants.filter((r) => r.coordinates.isExact).length;
  const osmCount = restaurants.filter((r) => r.sourceType === 'openstreetmap').length;
  const pendingCorrectionsCount = corrections.filter((c) => c.status === 'pending_review').length;

  const filteredListings = restaurants.filter((r) => {
    if (filterReviewStatus === 'all') return true;
    return (r.reviewStatus || 'approved') === filterReviewStatus;
  });

  const allSelected = filteredListings.length > 0 && selectedIds.length === filteredListings.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredListings.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Banner / Exit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded">
              Editorial Console
            </span>
            <span className="text-xs text-stone-500">· Dubai Restaurant Governance & Import Center</span>
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Registry & Data Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToBaseline}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline Data</span>
          </button>

          <button
            onClick={onExit}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
          >
            Return to Public Directory
          </button>
        </div>
      </div>

      {/* KPI Metrics Dashboard Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-6">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">Total Records</span>
          <div className="text-xl font-bold text-stone-900 font-mono-data mt-0.5">{totalCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">Unique Venues</span>
          <div className="text-xl font-bold text-stone-900 font-mono-data mt-0.5">{uniqueCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">Approved Public</span>
          <div className="text-xl font-bold text-emerald-700 font-mono-data mt-0.5">{approvedCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">Verified Coordinates</span>
          <div className="text-xl font-bold text-stone-900 font-mono-data mt-0.5">{exactCoordinatesCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">Verified Hours</span>
          <div className="text-xl font-bold text-amber-700 font-mono-data mt-0.5">{verifiedHoursCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">OSM Imported</span>
          <div className="text-xl font-bold text-blue-700 font-mono-data mt-0.5">{osmCount}</div>
        </div>
      </div>

      {statusMessage && (
        <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mt-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'listings'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Listing Review & Queue ({restaurants.length})
        </button>

        <button
          onClick={() => setActiveTab('import_center')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'import_center'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-stone-500" />
          <span>Free Data Import Center</span>
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'corrections'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Visitor Corrections</span>
          {pendingCorrectionsCount > 0 && (
            <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingCorrectionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('maps_bridge')}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'maps_bridge'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Google Maps Architecture
        </button>
      </div>

      {/* TAB 1: LISTING REVIEW & QUEUE */}
      {activeTab === 'listings' && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter by status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-600">Review Filter:</span>
              <select
                value={filterReviewStatus}
                onChange={(e) => setFilterReviewStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold"
              >
                <option value="all">All Listings ({restaurants.length})</option>
                <option value="approved">Approved for Public ({approvedCount})</option>
                <option value="pending_review">Pending Review</option>
                <option value="flagged">Flagged Listings</option>
              </select>
            </div>

            {/* Bulk actions & Add Button */}
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">{selectedIds.length} selected:</span>
                  <button
                    onClick={() => handleBulkAction('approve')}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleBulkAction('flag')}
                    className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold"
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-2.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setEditingRestaurant({
                    id: `venue-${Date.now()}`,
                    slug: 'new-dubai-venue',
                    name: '',
                    tagline: '',
                    description: '',
                    category: 'restaurant',
                    cuisine: ['International'],
                    priceTier: 'AED 80–180',
                    neighborhood: 'Downtown Dubai',
                    address: {
                      street: 'Financial Center Rd',
                      district: 'Downtown Dubai',
                      city: 'Dubai',
                      country: 'United Arab Emirates',
                      formattedAddress: 'Financial Center Rd, Downtown Dubai, Dubai, United Arab Emirates',
                    },
                    coordinates: {
                      lat: 25.1972,
                      lng: 55.2744,
                      isExact: true,
                      coordinateSource: 'Official Google Place ID',
                    },
                    googleMaps: {
                      placeId: '',
                      verifiedLocation: true,
                      viewUrl: '',
                      directionsUrl: '',
                    },
                    contact: { phone: '+971 4 000 0000' },
                    operatingHours: {
                      timeZone: 'Asia/Dubai',
                      schedule: [],
                    },
                    verification: {
                      status: 'unconfirmed',
                      verifiedAt: new Date().toISOString(),
                      lastCheckedAt: new Date().toISOString(),
                      verifiedBy: 'DineDubai Editorial Desk',
                      primarySource: 'Manual Direct Entry',
                      primarySourceUrl: '',
                      editorialNotes: 'Pending secondary verification against official municipal license.',
                      verifiedFields: ['name', 'address', 'coordinates'],
                    },
                    accolades: [],
                    dietary: ['Halal Certified'],
                    amenities: [],
                    image_url: null,
                    image_source_url: null,
                    image_source_name: null,
                    image_verified_at: null,
                    image_status: 'placeholder',
                    image_alt: 'New Dubai venue listing',
                    heroImage: '',
                    photos: [],
                    featured: false,
                    sourceType: 'editorial_verified',
                    reviewStatus: 'approved',
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Venue</span>
              </button>
            </div>
          </div>

          {/* Table of Listings */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-3 w-8">
                      <button onClick={toggleSelectAll} className="p-1 text-stone-500 hover:text-stone-900">
                        {allSelected ? <CheckSquare className="w-4 h-4 text-stone-900" /> : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="py-3 px-3">Venue & Category</th>
                    <th className="py-3 px-3">Neighborhood</th>
                    <th className="py-3 px-3">Coordinates & Maps Link</th>
                    <th className="py-3 px-3">Hours Status</th>
                    <th className="py-3 px-3">Source & Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredListings.map((restaurant) => {
                    const isSelected = selectedIds.includes(restaurant.id);
                    const isVerified = restaurant.verification.status === 'verified';
                    const hasHours = restaurant.operatingHours.schedule && restaurant.operatingHours.schedule.length > 0;
                    const hasValidView = isValidGoogleMapsUrl(restaurant.googleMaps.viewUrl);
                    const isOsm = restaurant.sourceType === 'openstreetmap';

                    return (
                      <tr key={restaurant.id} className={`hover:bg-stone-50/70 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}>
                        <td className="py-3.5 px-3">
                          <button onClick={() => toggleSelectOne(restaurant.id)} className="p-1 text-stone-500 hover:text-stone-900">
                            {isSelected ? <CheckSquare className="w-4 h-4 text-stone-900" /> : <Square className="w-4 h-4 text-stone-300" />}
                          </button>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-bold text-stone-900 font-serif-display text-sm">
                            {restaurant.name}
                          </div>
                          <div className="text-stone-500 text-[11px] font-medium capitalize">
                            {restaurant.category || 'Restaurant'} · {restaurant.cuisine.slice(0, 2).join(', ')}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-stone-700">
                          {restaurant.neighborhood}
                        </td>

                        <td className="py-3.5 px-3 font-mono-data">
                          <div className="text-stone-700">
                            {restaurant.coordinates.lat.toFixed(4)}, {restaurant.coordinates.lng.toFixed(4)}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {hasValidView ? (
                              <a
                                href={restaurant.googleMaps.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-700 font-sans font-semibold hover:underline flex items-center gap-0.5"
                              >
                                <span>Verified URL</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-sans font-semibold">
                                ⚠ Check URL
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          {hasHours && isVerified ? (
                            <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Verified Schedule
                            </span>
                          ) : hasHours ? (
                            <span className="text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                              Unconfirmed Hours
                            </span>
                          ) : (
                            <span className="text-[11px] text-amber-800 italic">
                              Unsupported / Blank
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            {isOsm ? (
                              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                                OSM (ODbL)
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                Editorial Verified
                              </span>
                            )}
                          </div>
                          {restaurant.sourceId && (
                            <div className="text-stone-400 text-[10px] font-mono-data mt-0.5 truncate max-w-[120px]">
                              {restaurant.sourceId}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleReverify(restaurant)}
                              title="Re-verify now"
                              className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setIsAddingNew(false);
                                setEditingRestaurant(JSON.parse(JSON.stringify(restaurant)));
                              }}
                              title="Edit listing"
                              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(restaurant.id, restaurant.name)}
                              title="Delete listing"
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FREE DATA IMPORT CENTER */}
      {activeTab === 'import_center' && (
        <div className="mt-6 space-y-6">
          <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>Authentic Free Data Import Pipeline</span>
            </div>
            <h2 className="font-serif-display text-2xl font-bold">
              Expand Directory with Genuine OpenStreetMap Records
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
              Import genuine restaurant and dining data under permissible licenses (such as OpenStreetMap Open Database License). Fictional or synthetic data is strictly prohibited. An automatic snapshot backup is captured prior to every bulk import.
            </p>

            <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Option A: Live Overpass Query */}
              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/80 space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>Live Overpass OSM Fetcher (By Neighbourhood)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Queries the official OpenStreetMap Overpass endpoint for genuine dining nodes in Dubai.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedOverpassArea}
                    onChange={(e) => setSelectedOverpassArea(e.target.value)}
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 p-2 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
                  >
                    <option value="downtown">Downtown Dubai (Burj Khalifa area)</option>
                    <option value="marina">Dubai Marina & JBR</option>
                    <option value="difc">DIFC (Financial Centre)</option>
                    <option value="deira">Deira & Old Dubai Creek</option>
                    <option value="burdubai">Bur Dubai & Al Fahidi</option>
                    <option value="jumeirah">Jumeirah & Kite Beach</option>
                    <option value="businessbay">Business Bay</option>
                    <option value="palm">Palm Jumeirah</option>
                    <option value="albarsha">Al Barsha & MOE</option>
                    <option value="all">Greater Dubai Urban Area</option>
                  </select>
                  <button
                    disabled={isOverpassLoading || isImporting}
                    onClick={handleFetchOverpass}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {isOverpassLoading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Querying...</span>
                      </>
                    ) : (
                      <>
                        <Globe2 className="w-3.5 h-3.5" />
                        <span>Fetch Live</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option B: Pre-Curated Instant OSM Dataset */}
              <div className="p-4 bg-stone-800/80 rounded-xl border border-stone-700/80 space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Curated Verified OSM Dataset (Offline / Instant)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Pre-verified genuine OpenStreetMap records across 10 Dubai districts. Immune to Overpass API rate limits or network delays.
                </p>
                <button
                  disabled={isImporting || isOverpassLoading}
                  onClick={handleImportOsmCurated}
                  className="w-full py-2 px-3 bg-stone-100 hover:bg-white text-stone-950 font-bold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Importing Dataset...' : 'Import Curated OSM Dataset (22+ Venues)'}</span>
                </button>
              </div>
            </div>
          </div>

          {importSummary && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-2">
              <div className="font-bold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Import Operation Summary</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-data pt-1">
                <div>Imported: <strong>{importSummary.importedCount}</strong></div>
                <div>Duplicates Skipped: <strong>{importSummary.duplicateCount}</strong></div>
                <div>Flagged for Review: <strong>{importSummary.flaggedCount}</strong></div>
                <div>Backup Snapshot: <strong>{importSummary.backupPath ? 'Created' : 'N/A'}</strong></div>
              </div>
            </div>
          )}

          {/* Import Methods: GeoJSON and CSV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GeoJSON Import Box */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-stone-700" />
                <h3 className="font-bold text-stone-900 text-sm">Import GeoJSON File / Text</h3>
              </div>
              <p className="text-xs text-stone-500">
                Supports OpenStreetMap GeoJSON feature collections with Point coordinates <code className="font-mono-data">[lng, lat]</code> and properties (<code className="font-mono-data">name, amenity, addr:district</code>).
              </p>

              <textarea
                rows={6}
                value={geoJsonInput}
                onChange={(e) => setGeoJsonInput(e.target.value)}
                placeholder='Paste GeoJSON FeatureCollection or click file upload below...'
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono-data text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex items-center justify-between gap-3">
                <input
                  type="file"
                  accept=".geojson,.json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setGeoJsonInput(event.target?.result as string);
                      reader.readAsText(file);
                    }
                  }}
                  className="text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                />

                <button
                  disabled={isImporting || !geoJsonInput.trim()}
                  onClick={handleImportGeoJson}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs"
                >
                  Parse & Import
                </button>
              </div>
            </div>

            {/* CSV Import Box */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-700" />
                <h3 className="font-bold text-stone-900 text-sm">Import CSV File / Text</h3>
              </div>
              <p className="text-xs text-stone-500">
                Headers expected: <code className="font-mono-data">name, category, cuisine, neighborhood, street, lat, lng, phone</code>.
              </p>

              <textarea
                rows={6}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="name,category,cuisine,neighborhood,street,lat,lng,phone
Allo Beirut,restaurant,Lebanese Street Food,Hessa St,Al Barsha,25.0921,55.1912,+971 800 8623478"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl font-mono-data text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex items-center justify-between gap-3">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setCsvInput(event.target?.result as string);
                      reader.readAsText(file);
                    }
                  }}
                  className="text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                />

                <button
                  disabled={isImporting || !csvInput.trim()}
                  onClick={handleImportCsv}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs"
                >
                  Parse & Import
                </button>
              </div>
            </div>
          </div>

          {/* Database Backup & Restore List */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-stone-600" />
                Snapshot Backups Archive (Automated before imports)
              </h4>
              <button
                onClick={fetchBackups}
                className="text-xs text-stone-500 hover:text-stone-900 underline"
              >
                Refresh List
              </button>
            </div>

            {backups.length === 0 ? (
              <p className="text-xs text-stone-400">No backup snapshots created yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {backups.map((b) => (
                  <div key={b} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg text-xs">
                    <span className="font-mono-data text-stone-700">{b}</span>
                    <button
                      onClick={() => handleRestoreBackup(b)}
                      className="text-amber-800 font-bold hover:underline ml-3"
                    >
                      Restore Snapshot
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VISITOR CORRECTIONS */}
      {activeTab === 'corrections' && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-stone-600">
              Diner and visitor reported corrections. Cross-reference source evidence before approving changes.
            </p>
            <button
              onClick={fetchCorrections}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg bg-white"
            >
              Refresh Queue
            </button>
          </div>

          {corrections.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center text-xs text-stone-500">
              No correction reports in the queue.
            </div>
          ) : (
            <div className="space-y-3">
              {corrections.map((corr) => {
                const isPending = corr.status === 'pending_review';
                const isApproved = corr.status === 'approved_and_applied';

                return (
                  <div
                    key={corr.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                          {corr.field.replace('_', ' ')}
                        </span>
                        <h4 className="font-serif-display text-base font-bold text-stone-900">
                          {corr.restaurantName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            isPending
                              ? 'bg-amber-100 text-amber-900'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {corr.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-stone-400 font-mono-data">
                          {corr.submittedAt.split('T')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <strong className="text-stone-700 block mb-1">Reported Information:</strong>
                        <p className="text-stone-900">{corr.reportedValue}</p>
                      </div>

                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <strong className="text-stone-700 block mb-1">Source Evidence Cited:</strong>
                        <p className="text-stone-900">{corr.sourceEvidence}</p>
                      </div>
                    </div>

                    {isPending && (
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            const notes = prompt('Enter admin investigation notes:');
                            handleUpdateCorrectionStatus(corr.id, 'investigating', notes || undefined);
                          }}
                          className="px-3 py-1.5 text-stone-700 hover:bg-stone-100 rounded-lg font-semibold"
                        >
                          Mark Investigating
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Enter rejection reason:');
                            handleUpdateCorrectionStatus(corr.id, 'rejected', notes || undefined);
                          }}
                          className="px-3 py-1.5 text-red-700 hover:bg-red-50 rounded-lg font-semibold"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Enter approval & verification notes:');
                            handleUpdateCorrectionStatus(corr.id, 'approved_and_applied', notes || 'Verified with venue.');
                          }}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-xs"
                        >
                          Approve & Apply
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GOOGLE MAPS ARCHITECTURE */}
      {activeTab === 'maps_bridge' && (
        <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-2">
              Google Maps URL Integration Architecture
            </h3>
            <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
              As required, Google Maps integration functions 100% free of charge without requiring a Google Maps API key or paid quota, using properly encoded Google Maps Schemes linked directly to each venue's verified coordinates and address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <span className="font-bold text-stone-900 text-sm block">1. "View on Google Maps" URL Scheme</span>
              <p className="text-stone-600">
                Encodes the verified venue name, physical district, and coordinates/Place ID:
              </p>
              <code className="block p-2 bg-white rounded border border-stone-200 text-stone-800 font-mono-data text-[11px] break-all">
                https://www.google.com/maps/search/?api=1&query=At.mosphere%2C+Burj+Khalifa%2C+Downtown+Dubai...
              </code>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <span className="font-bold text-stone-900 text-sm block">2. "Get Directions" URL Scheme</span>
              <p className="text-stone-600">
                Launches turn-by-turn navigation directly with the user’s device geolocation as origin:
              </p>
              <code className="block p-2 bg-white rounded border border-stone-200 text-stone-800 font-mono-data text-[11px] break-all">
                https://www.google.com/maps/dir/?api=1&destination=At.mosphere%2C+Burj+Khalifa...
              </code>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE RESTAURANT MODAL */}
      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                {isAddingNew ? 'Add Dubai Venue' : `Edit: ${editingRestaurant.name}`}
              </h3>
              <button
                onClick={() => setEditingRestaurant(null)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  value={editingRestaurant.name}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Arabic Name</label>
                <input
                  type="text"
                  value={editingRestaurant.arabicName || ''}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, arabicName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Dining Category *</label>
                <select
                  value={editingRestaurant.category || 'restaurant'}
                  onChange={(e) =>
                    setEditingRestaurant({ ...editingRestaurant, category: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50 capitalize"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="bistro">Bistro</option>
                  <option value="fast_food">Fast Food / Street Food</option>
                  <option value="bakery">Bakery & Pastry</option>
                  <option value="bar">Bar & Lounge</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Neighborhood *</label>
                <input
                  type="text"
                  value={editingRestaurant.neighborhood}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, neighborhood: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Price Tier *</label>
                <select
                  value={editingRestaurant.priceTier}
                  onChange={(e) =>
                    setEditingRestaurant({ ...editingRestaurant, priceTier: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                >
                  <option value="AED 30–80">AED 30–80 (Casual / Street Food)</option>
                  <option value="AED 80–180">AED 80–180 (Midscale / Bistros)</option>
                  <option value="AED 180–400">AED 180–400 (Upscale Dining)</option>
                  <option value="AED 400+">AED 400+ (Fine Dining / Tasting)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Review Status *</label>
                <select
                  value={editingRestaurant.reviewStatus || 'approved'}
                  onChange={(e) =>
                    setEditingRestaurant({ ...editingRestaurant, reviewStatus: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                >
                  <option value="approved">Approved (Publicly Visible)</option>
                  <option value="pending_review">Pending Review (Admin Only)</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Formatted Address *</label>
                <input
                  type="text"
                  value={editingRestaurant.address.formattedAddress}
                  onChange={(e) =>
                    setEditingRestaurant({
                      ...editingRestaurant,
                      address: { ...editingRestaurant.address, formattedAddress: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Latitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={editingRestaurant.coordinates.lat}
                  onChange={(e) =>
                    setEditingRestaurant({
                      ...editingRestaurant,
                      coordinates: { ...editingRestaurant.coordinates, lat: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50 font-mono-data"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Longitude *</label>
                <input
                  type="number"
                  step="0.000001"
                  value={editingRestaurant.coordinates.lng}
                  onChange={(e) =>
                    setEditingRestaurant({
                      ...editingRestaurant,
                      coordinates: { ...editingRestaurant.coordinates, lng: parseFloat(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50 font-mono-data"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingRestaurant.tagline}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, tagline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingRestaurant.description}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                />
              </div>

              {/* Image & Verification Metadata Fields */}
              <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                <span className="font-semibold text-stone-900 block mb-2 text-xs uppercase tracking-wider">
                  Image &amp; Verification Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Image Status</label>
                    <select
                      value={editingRestaurant.image_status || 'placeholder'}
                      onChange={(e) =>
                        setEditingRestaurant({
                          ...editingRestaurant,
                          image_status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                    >
                      <option value="placeholder">Placeholder (Professional Neutral Graphic)</option>
                      <option value="verified">Verified (Official / Permitted License)</option>
                      <option value="unverified">Unverified (Pending Review)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Image URL (Optional)</label>
                    <input
                      type="url"
                      value={editingRestaurant.image_url || ''}
                      onChange={(e) =>
                        setEditingRestaurant({
                          ...editingRestaurant,
                          image_url: e.target.value || null,
                          image_status: e.target.value ? 'verified' : 'placeholder',
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 border rounded-lg bg-stone-50 font-mono-data"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Image Source / Credit</label>
                    <input
                      type="text"
                      value={editingRestaurant.image_source_name || ''}
                      onChange={(e) =>
                        setEditingRestaurant({
                          ...editingRestaurant,
                          image_source_name: e.target.value || null,
                        })
                      }
                      placeholder="e.g. Official Media Kit / Photographer"
                      className="w-full px-3 py-2 border rounded-lg bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Image Source URL</label>
                    <input
                      type="url"
                      value={editingRestaurant.image_source_url || ''}
                      onChange={(e) =>
                        setEditingRestaurant({
                          ...editingRestaurant,
                          image_source_url: e.target.value || null,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 border rounded-lg bg-stone-50 font-mono-data"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingRestaurant(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveRestaurant(editingRestaurant)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-white bg-stone-900 hover:bg-stone-800 font-semibold rounded-lg shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
