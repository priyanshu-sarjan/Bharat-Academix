import { NextResponse } from 'next/server';
import { INITIAL_TRUCKS } from '@/lib/mockData';
import { calculateDecayVelocity } from '@/lib/simulator/decayCalculator';

export async function GET() {
  const telemetry = INITIAL_TRUCKS.map((truck) => {
    const velocity = calculateDecayVelocity(truck.ambientTempCelsius);
    return {
      truckId: truck.id,
      licensePlate: truck.licensePlate,
      ambientTempCelsius: truck.ambientTempCelsius,
      humidityPct: truck.humidityPct,
      vibrationHealth: truck.vibrationHealth,
      status: truck.status,
      decayVelocityPtsPerHr: Number(velocity.toFixed(2)),
      thresholdMax: truck.tempThresholdMax,
      timestamp: new Date().toISOString(),
    };
  });

  return NextResponse.json({
    status: 'SUCCESS',
    engine: 'AyuTrace IoT Telemetry Simulator v2.0',
    count: telemetry.length,
    data: telemetry,
  });
}
