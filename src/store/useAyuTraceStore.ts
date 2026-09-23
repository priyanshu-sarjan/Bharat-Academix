import { create } from 'zustand';
import {
  FarmCluster,
  ColdChainTruck,
  FlashDiscountOffer,
  TelemetryLog,
  ImpactMetrics,
  ViewTab,
  CropType,
} from '@/types/ayutrace';
import {
  INITIAL_FARM_CLUSTERS,
  INITIAL_TRUCKS,
  INITIAL_FLASH_OFFERS,
  INITIAL_IMPACT_METRICS,
} from '@/lib/mockData';
import {
  calculateDecayVelocity,
  calculateRemainingShelfLife,
  determineTier,
  calculateFlashDiscount,
} from '@/lib/simulator/decayCalculator';

interface UserState {
  name: string;
  role: 'COOPERATIVE_ADMIN' | 'COLD_CHAIN_LOGISTICS' | 'WHOLESALE_BUYER';
  isLoggedIn: boolean;
}

interface AyuTraceStore {
  activeTab: ViewTab;
  clusters: FarmCluster[];
  trucks: ColdChainTruck[];
  flashOffers: FlashDiscountOffer[];
  telemetryLogs: TelemetryLog[];
  metrics: ImpactMetrics;
  selectedClusterId: string | null;
  selectedTruckId: string | null;
  searchQuery: string;
  isSimulating: boolean;
  simSpeed: number;
  
  // Modals & User state
  isAddClusterOpen: boolean;
  isReserveModalOpen: boolean;
  activeReserveOffer: FlashDiscountOffer | null;
  isLoginModalOpen: boolean;
  user: UserState;

  // Actions
  setActiveTab: (tab: ViewTab) => void;
  setSelectedClusterId: (id: string | null) => void;
  setSelectedTruckId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleSimulating: () => void;
  setSimSpeed: (speed: number) => void;
  
  // Simulation & IoT Events
  triggerTempSpike: (truckId: string) => void;
  rerouteTruck: (truckId: string, newMandi: string) => void;
  addFarmCluster: (cluster: Omit<FarmCluster, 'id' | 'harvestTimestamp' | 'decayScore' | 'estShelfLifeHours' | 'tier' | 'clusterRadiusMeters'>) => void;
  claimFlashOffer: (offerId: string, buyerName: string) => void;
  tickSimulation: () => void;

  // Modals
  setAddClusterOpen: (open: boolean) => void;
  openReserveModal: (offer: FlashDiscountOffer) => void;
  closeReserveModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginUser: (name: string, role: UserState['role']) => void;
  logoutUser: () => void;
}

export const useAyuTraceStore = create<AyuTraceStore>((set, get) => ({
  activeTab: 'COMMAND_MAP',
  clusters: INITIAL_FARM_CLUSTERS,
  trucks: INITIAL_TRUCKS,
  flashOffers: INITIAL_FLASH_OFFERS,
  telemetryLogs: [
    {
      id: 'log_1',
      timestamp: new Date().toLocaleTimeString(),
      truckId: 'truck_1',
      truckPlate: 'MH-15-EG-4921',
      temp: 9.4,
      humidity: 78,
      vibration: 2.1,
      decayVelocity: calculateDecayVelocity(9.4),
      decayScore: 68,
      alertLevel: 'CRITICAL',
      message: 'ALERT: Core temp spike 9.4°C (>8°C threshold). Exponential decay activated. Rerouted to Vashi Mandi.',
    },
    {
      id: 'log_2',
      timestamp: new Date().toLocaleTimeString(),
      truckId: 'truck_3',
      truckPlate: 'TN-61-AY-3091',
      temp: 11.2,
      humidity: 85,
      vibration: 3.4,
      decayVelocity: calculateDecayVelocity(11.2),
      decayScore: 74,
      alertLevel: 'CRITICAL',
      message: 'CRITICAL: Ambient temp 11.2°C. Tier-1 Flash Sale deployed (-50% discount at Koyambedu Market).',
    },
  ],
  metrics: INITIAL_IMPACT_METRICS,
  selectedClusterId: 'cluster_1',
  selectedTruckId: 'truck_1',
  searchQuery: '',
  isSimulating: true,
  simSpeed: 1,

  isAddClusterOpen: false,
  isReserveModalOpen: false,
  activeReserveOffer: null,
  isLoginModalOpen: false,
  user: {
    name: 'Smart Farmer Admin',
    role: 'COOPERATIVE_ADMIN',
    isLoggedIn: true,
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedClusterId: (id) => set({ selectedClusterId: id }),
  setSelectedTruckId: (id) => set({ selectedTruckId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSimulating: () => set((state) => ({ isSimulating: !state.isSimulating })),
  setSimSpeed: (speed) => set({ simSpeed: speed }),

  triggerTempSpike: (truckId) => {
    const { trucks, clusters, flashOffers, telemetryLogs, metrics } = get();
    const updatedTrucks = trucks.map((truck) => {
      if (truck.id === truckId) {
        const newTemp = Number((8.5 + Math.random() * 4.5).toFixed(1));
        return {
          ...truck,
          ambientTempCelsius: newTemp,
          status: 'REROUTING_URGENT' as const,
        };
      }
      return truck;
    });

    const targetTruck = updatedTrucks.find((t) => t.id === truckId);
    if (!targetTruck) return;

    // Accelerate decay on assigned cluster
    const updatedClusters = clusters.map((cluster) => {
      if (cluster.id === targetTruck.assignedClusterId) {
        const velocity = calculateDecayVelocity(targetTruck.ambientTempCelsius);
        const newDecayScore = Math.min(98, cluster.decayScore + 18);
        const newShelfLife = calculateRemainingShelfLife(newDecayScore, velocity);
        const newTier = determineTier(newShelfLife, newDecayScore);

        return {
          ...cluster,
          decayScore: newDecayScore,
          estShelfLifeHours: newShelfLife,
          tier: newTier,
        };
      }
      return cluster;
    });

    const targetCluster = updatedClusters.find((c) => c.id === targetTruck.assignedClusterId);

    // Create emergency flash offer if Tier 1
    let newOffers = [...flashOffers];
    if (targetCluster && targetCluster.tier === 'TIER_1') {
      const existingOffer = flashOffers.find((o) => o.clusterId === targetCluster.id);
      if (!existingOffer) {
        const discountPct = calculateFlashDiscount(targetCluster.decayScore, targetCluster.surplusMarginPct);
        const basePrice = targetCluster.crop === 'Tomato' ? 35 : targetCluster.crop === 'Leafy Greens' ? 40 : 50;
        const discountedPrice = Math.round(basePrice * (1 - discountPct / 100));

        newOffers.unshift({
          id: `offer_${Date.now()}`,
          clusterId: targetCluster.id,
          crop: targetCluster.crop,
          originalPricePerKg: basePrice,
          discountedPricePerKg: discountedPrice,
          discountPercentage: discountPct,
          expiresInMinutes: 60,
          targetMandi: targetCluster.nearestMandi,
          availableTons: targetCluster.volumeTons,
          urgentReason: `Emergency Temp Spike (${targetTruck.ambientTempCelsius}°C). Shelf-life degraded to ${targetCluster.estShelfLifeHours}h.`,
          status: 'ACTIVE',
        });
      }
    }

    const newLog: TelemetryLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      truckId: targetTruck.id,
      truckPlate: targetTruck.licensePlate,
      temp: targetTruck.ambientTempCelsius,
      humidity: targetTruck.humidityPct,
      vibration: targetTruck.vibrationHealth,
      decayVelocity: calculateDecayVelocity(targetTruck.ambientTempCelsius),
      decayScore: targetCluster ? targetCluster.decayScore : 50,
      alertLevel: 'CRITICAL',
      message: `MANUAL SPIKE TRIGGERED: Temp jumped to ${targetTruck.ambientTempCelsius}°C on ${targetTruck.licensePlate}. Auto-rerouted to nearest emergency Mandi.`,
    };

    set({
      trucks: updatedTrucks,
      clusters: updatedClusters,
      flashOffers: newOffers,
      telemetryLogs: [newLog, ...telemetryLogs.slice(0, 19)],
      metrics: {
        ...metrics,
        spoilagePreventedTons: Number((metrics.spoilagePreventedTons + 4.2).toFixed(1)),
        revenueRecoveredInr: metrics.revenueRecoveredInr + 85000,
      },
    });
  },

  rerouteTruck: (truckId, newMandi) => {
    set((state) => ({
      trucks: state.trucks.map((t) =>
        t.id === truckId
          ? { ...t, targetDestination: newMandi, status: 'OPTIMAL' }
          : t
      ),
      telemetryLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          truckId,
          truckPlate: state.trucks.find((t) => t.id === truckId)?.licensePlate || truckId,
          temp: state.trucks.find((t) => t.id === truckId)?.ambientTempCelsius || 4.0,
          humidity: 65,
          vibration: 1.5,
          decayVelocity: 0.3,
          decayScore: 40,
          alertLevel: 'MODERATE',
          message: `AUTONOMOUS REROUTE CONFIRMED: Truck rerouted to ${newMandi}. TSP 2-opt fuel optimization applied (-35.4% diesel cut).`,
        },
        ...state.telemetryLogs.slice(0, 19),
      ],
    }));
  },

  addFarmCluster: (clusterData) => {
    const { clusters } = get();
    const id = `cluster_${Date.now()}`;
    const decayScore = 15;
    const estShelfLifeHours = 72;
    const tier = determineTier(estShelfLifeHours, decayScore);

    const newCluster: FarmCluster = {
      ...clusterData,
      id,
      harvestTimestamp: new Date().toISOString(),
      decayScore,
      estShelfLifeHours,
      tier,
      clusterRadiusMeters: 50,
    };

    set({
      clusters: [newCluster, ...clusters],
      isAddClusterOpen: false,
    });
  },

  claimFlashOffer: (offerId, buyerName) => {
    const { flashOffers, metrics } = get();
    const offer = flashOffers.find((o) => o.id === offerId);
    if (!offer) return;

    const savedTons = offer.availableTons;
    const recoveredInr = Math.round(offer.discountedPricePerKg * savedTons * 1000);

    set({
      flashOffers: flashOffers.map((o) =>
        o.id === offerId ? { ...o, status: 'CLAIMED' } : o
      ),
      metrics: {
        ...metrics,
        spoilagePreventedTons: Number((metrics.spoilagePreventedTons + savedTons).toFixed(1)),
        revenueRecoveredInr: metrics.revenueRecoveredInr + recoveredInr,
      },
      isReserveModalOpen: false,
      activeReserveOffer: null,
    });
  },

  tickSimulation: () => {
    const { isSimulating, simSpeed, trucks, clusters, telemetryLogs } = get();
    if (!isSimulating) return;

    // Slightly evolve truck positions and temperatures
    const updatedTrucks = trucks.map((truck) => {
      // Small ambient temp oscillation (-0.2 to +0.2 * simSpeed)
      const tempDelta = (Math.random() - 0.48) * 0.2 * simSpeed;
      const newTemp = Math.max(1.5, Math.min(14.0, Number((truck.ambientTempCelsius + tempDelta).toFixed(1))));

      // Small GPS coordinate jitter simulating highway transit
      const latDelta = (Math.random() - 0.5) * 0.002 * simSpeed;
      const lngDelta = (Math.random() - 0.5) * 0.002 * simSpeed;

      const newStatus = newTemp > 8.0 ? ('REROUTING_URGENT' as const) : ('OPTIMAL' as const);

      return {
        ...truck,
        ambientTempCelsius: newTemp,
        status: newStatus,
        currentLocation: [
          Number((truck.currentLocation[0] + latDelta).toFixed(4)),
          Number((truck.currentLocation[1] + lngDelta).toFixed(4)),
        ] as [number, number],
      };
    });

    // Update clusters decay scores based on truck temp
    const updatedClusters = clusters.map((cluster) => {
      const assignedTruck = updatedTrucks.find((t) => t.assignedClusterId === cluster.id);
      const temp = assignedTruck ? assignedTruck.ambientTempCelsius : 4.0;
      const velocity = calculateDecayVelocity(temp);
      const scoreGain = (velocity / 60) * simSpeed; // 1 tick = ~1 minute simulated
      const newScore = Math.min(99, Number((cluster.decayScore + scoreGain).toFixed(1)));
      const newShelfLife = calculateRemainingShelfLife(newScore, velocity);
      const newTier = determineTier(newShelfLife, newScore);

      return {
        ...cluster,
        decayScore: newScore,
        estShelfLifeHours: newShelfLife,
        tier: newTier,
      };
    });

    set({
      trucks: updatedTrucks,
      clusters: updatedClusters,
    });
  },

  setAddClusterOpen: (open) => set({ isAddClusterOpen: open }),
  openReserveModal: (offer) => set({ isReserveModalOpen: true, activeReserveOffer: offer }),
  closeReserveModal: () => set({ isReserveModalOpen: false, activeReserveOffer: null }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  loginUser: (name, role) => set({ user: { name, role, isLoggedIn: true }, isLoginModalOpen: false }),
  logoutUser: () => set({ user: { name: 'Guest', role: 'WHOLESALE_BUYER', isLoggedIn: false } }),
}));
