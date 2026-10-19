/**
 * DineDubai Configuration & Owner Information
 * 
 * IMPORTANT NOTE:
 * Per our authentic data policy, owner-specific legal facts (trade license, registered legal name,
 * physical corporate registration) are NOT fabricated. Placeholders marked below are configurable
 * and must be completed with the site owner's actual UAE business registration details prior to launch.
 */

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  tagline: string;
  description: string;
  legalEntity: {
    registeredName: string;
    tradeLicenseNumber: string;
    jurisdiction: string;
    registeredAddress: string;
    corporateEmail: string;
    editorialEmail: string;
    correctionsEmail: string;
    telephone: string;
    dataProtectionOfficerEmail: string;
  };
  editorial: {
    lastUpdated: string;
    primaryStandards: string[];
    timeZone: string;
    coordinatesDatum: string;
  };
  monetization: {
    hasAffiliateLinks: boolean;
    hasSponsoredContent: boolean;
    displayAdsEnabled: boolean;
  };
}

export const SITE_CONFIG: SiteConfig = {
  siteName: 'DineDubai',
  siteUrl: 'https://dinedubai.guide',
  tagline: 'Verified Dubai Restaurant Directory & Geographic Navigation',
  description: 'Authentic Dubai restaurant discovery with genuine operating hours in Asia/Dubai timezone, municipal verification records, interactive maps, and exact Google Maps turn-by-turn navigation.',
  legalEntity: {
    registeredName: '[LEGAL_ENTITY_NAME_TO_BE_SUPPLIED_BEFORE_LAUNCH]',
    tradeLicenseNumber: '[UAE_DET_TRADE_LICENSE_TO_BE_SUPPLIED]',
    jurisdiction: 'Dubai, United Arab Emirates (Dubai Department of Economy and Tourism)',
    registeredAddress: '[REGISTERED_OFFICE_ADDRESS_TO_BE_SUPPLIED, DUBAI, UAE]',
    corporateEmail: 'legal@dinedubai.guide',
    editorialEmail: 'editorial@dinedubai.guide',
    correctionsEmail: 'corrections@dinedubai.guide',
    telephone: '+971 4 [TELEPHONE_TO_BE_SUPPLIED]',
    dataProtectionOfficerEmail: 'privacy@dinedubai.guide',
  },
  editorial: {
    lastUpdated: 'October 2026',
    primaryStandards: [
      'Dubai Department of Economy and Tourism (DET) Registry',
      'Michelin Guide Dubai (2024 / 2025 Edition)',
      'Gault & Millau UAE Fine Dining Guide',
      'OpenStreetMap Contributors (Open Database License)',
      'Direct On-Site Physical Door Sign Audits',
    ],
    timeZone: 'Asia/Dubai (GST, UTC+4)',
    coordinatesDatum: 'WGS84 (World Geodetic System 1984)',
  },
  monetization: {
    hasAffiliateLinks: true,
    hasSponsoredContent: false,
    displayAdsEnabled: false,
  },
};
