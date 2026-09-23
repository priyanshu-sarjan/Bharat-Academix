import { NextResponse } from 'next/server';
import { INITIAL_FARM_CLUSTERS } from '@/lib/mockData';
import { clusterFarmPoints } from '@/lib/gis/turfCluster';

export async function GET() {
  const points = INITIAL_FARM_CLUSTERS.map((c) => ({
    id: c.id,
    lat: c.coordinates[0],
    lng: c.coordinates[1],
    weight: c.volumeTons,
  }));

  const turfClusters = clusterFarmPoints(points, 50);

  return NextResponse.json({
    status: 'SUCCESS',
    engine: 'Turf.js 50m Spatial Clustering Engine',
    clusters: INITIAL_FARM_CLUSTERS,
    turfDeduplicationSummary: turfClusters,
  });
}
