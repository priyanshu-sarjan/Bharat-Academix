import { NextResponse } from 'next/server';
import { INITIAL_FARM_CLUSTERS, INITIAL_TRUCKS } from '@/lib/mockData';
import { solve2OptTSP, TSPWaypoint } from '@/lib/gis/tspSolver';

export async function GET() {
  const sampleWaypoints: TSPWaypoint[] = [
    { id: 'depot', name: 'Nashik Transit Depot', coordinates: INITIAL_TRUCKS[0].currentLocation, isDepot: true },
    { id: 'cluster_1', name: INITIAL_FARM_CLUSTERS[0].locationName, coordinates: INITIAL_FARM_CLUSTERS[0].coordinates },
    { id: 'cluster_5', name: INITIAL_FARM_CLUSTERS[4].locationName, coordinates: INITIAL_FARM_CLUSTERS[4].coordinates },
    { id: 'mandi', name: 'Vashi Mandi, Navi Mumbai', coordinates: [19.0760, 72.8777], isDestination: true },
  ];

  const tsp = solve2OptTSP(sampleWaypoints);

  return NextResponse.json({
    status: 'SUCCESS',
    engine: 'OSRM 2-Opt Traveling Salesperson Algorithm',
    tspOptimization: tsp,
  });
}
