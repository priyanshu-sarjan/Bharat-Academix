export type CropType = 'Tomato' | 'Mango' | 'Leafy Greens' | 'Wheat' | 'Onion';

export interface FarmCluster {
  id: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  crop: CropType;
  surplusMarginPct: number; // e.g. 108 for +108%
  volumeTons: number;
  harvestTimestamp: string;
  decayScore: number; // 0 (fresh) to 100 (spoiled)
  estShelfLifeHours: number;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  nearestMandi: string;
  clusterRadiusMeters: number;
  convexHullPoints?: [number, number][];
  farmerName: string;
  cooperativeName: string;
}

export interface ColdChainTruck {
  id: string;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  currentLocation: [number, number]; // [lat, lng]
  targetDestination: string;
  ambientTempCelsius: number;
  humidityPct: number;
  vibrationHealth: number; // 0-10 m/s^2 scale
  tempThresholdMax: number; // e.g. 4.0 or 8.0 C
  status: 'OPTIMAL' | 'REROUTING_URGENT' | 'AT_DEPOT';
  assignedClusterId: string;
  speedKmh: number;
  routePolyline?: [number, number][];
}

export interface FlashDiscountOffer {
  id: string;
  clusterId: string;
  crop: CropType;
  originalPricePerKg: number;
  discountedPricePerKg: number;
  discountPercentage: number;
  expiresInMinutes: number;
  targetMandi: string;
  availableTons: number;
  urgentReason: string;
  status: 'ACTIVE' | 'CLAIMED' | 'EXPIRED';
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  truckId: string;
  truckPlate: string;
  temp: number;
  humidity: number;
  vibration: number;
  decayVelocity: number;
  decayScore: number;
  alertLevel: 'NORMAL' | 'MODERATE' | 'CRITICAL';
  message: string;
}

export interface ImpactMetrics {
  spoilagePreventedTons: number;
  spoilagePreventedPct: number;
  fuelSavedPct: number;
  mileageSavedKm: number;
  co2SavedKg: number;
  openStandardSavingsUsd: number;
  revenueRecoveredInr: number;
}

export type ViewTab = 'COMMAND_MAP' | 'TELEMETRY_ANALYTICS' | 'DISPATCH_ENGINE' | 'FLASH_CLEARANCE' | 'IMPACT_REPORTS';
