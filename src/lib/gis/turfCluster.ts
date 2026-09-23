import * as turf from '@turf/turf';

export interface SpatialPoint {
  id: string;
  lat: number;
  lng: number;
  weight: number;
}

export interface SpatialClusterResult {
  clusterId: string;
  centroid: [number, number]; // [lat, lng]
  pointIds: string[];
  convexHullCoordinates?: [number, number][]; // [[lat, lng], ...]
}

/**
 * Perform 50-meter radius spatial clustering deduplication on agricultural farm surplus points.
 */
export function clusterFarmPoints(points: SpatialPoint[], radiusMeters: number = 50): SpatialClusterResult[] {
  if (!points || points.length === 0) return [];

  const featureCollection = turf.featureCollection(
    points.map((p) =>
      turf.point([p.lng, p.lat], { id: p.id, weight: p.weight })
    )
  );

  // Group points within radiusMeters using Turf distance
  const visited = new Set<string>();
  const clusters: SpatialClusterResult[] = [];

  points.forEach((p, idx) => {
    if (visited.has(p.id)) return;

    const clusterPoints: SpatialPoint[] = [p];
    visited.add(p.id);

    const fromPt = turf.point([p.lng, p.lat]);

    points.forEach((other, oIdx) => {
      if (idx === oIdx || visited.has(other.id)) return;
      const toPt = turf.point([other.lng, other.lat]);
      const distance = turf.distance(fromPt, toPt, { units: 'meters' });

      if (distance <= radiusMeters) {
        clusterPoints.push(other);
        visited.add(other.id);
      }
    });

    // Compute Centroid
    const sumLat = clusterPoints.reduce((acc, pt) => acc + pt.lat, 0);
    const sumLng = clusterPoints.reduce((acc, pt) => acc + pt.lng, 0);
    const centroid: [number, number] = [
      sumLat / clusterPoints.length,
      sumLng / clusterPoints.length,
    ];

    // Compute Convex Hull if > 2 points
    let hullCoords: [number, number][] | undefined = undefined;
    if (clusterPoints.length >= 3) {
      const turfPoints = turf.featureCollection(
        clusterPoints.map((cp) => turf.point([cp.lng, cp.lat]))
      );
      const hull = turf.convex(turfPoints);
      if (hull && hull.geometry && hull.geometry.coordinates) {
        const ring = hull.geometry.coordinates[0];
        hullCoords = ring.map((coord) => [coord[1], coord[0]]); // convert [lng, lat] to [lat, lng]
      }
    }

    clusters.push({
      clusterId: `cluster_${idx + 1}`,
      centroid,
      pointIds: clusterPoints.map((cp) => cp.id),
      convexHullCoordinates: hullCoords,
    });
  });

  return clusters;
}

/**
 * Calculates straight line distance in km between two lat/lng pairs.
 */
export function calculateDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const p1 = turf.point([coord1[1], coord1[0]]);
  const p2 = turf.point([coord2[1], coord2[0]]);
  return Math.round(turf.distance(p1, p2, { units: 'kilometers' }) * 10) / 10;
}
