import { FarmCluster, ColdChainTruck } from '@/types/ayutrace';

/**
 * Calculates dynamic decay velocity (score gain per hour) based on ambient core temperature.
 * - <4°C: Linear slow decay (0.15 pts/hr)
 * - 4-8°C: Moderate decay (0.75 pts/hr)
 * - >8°C: Exponential decay acceleration: 2.5 * e^(0.18 * (temp - 8))
 */
export function calculateDecayVelocity(tempCelsius: number): number {
  if (tempCelsius <= 4) {
    return 0.15;
  } else if (tempCelsius <= 8) {
    return 0.75 + (tempCelsius - 4) * 0.2;
  } else {
    // Exponential decay acceleration above 8°C threshold
    return 2.5 * Math.exp(0.18 * (tempCelsius - 8));
  }
}

/**
 * Estimates remaining shelf-life hours based on current decay score and decay velocity.
 */
export function calculateRemainingShelfLife(decayScore: number, decayVelocity: number): number {
  if (decayScore >= 100) return 0;
  const remainingScore = 100 - decayScore;
  const rawHours = remainingScore / Math.max(0.1, decayVelocity);
  return Math.max(1, Math.round(rawHours * 10) / 10);
}

/**
 * Determines transit dispatch tier based on remaining shelf life and decay score.
 */
export function determineTier(estShelfLifeHours: number, decayScore: number): 'TIER_1' | 'TIER_2' | 'TIER_3' {
  if (estShelfLifeHours < 24 || decayScore >= 65) {
    return 'TIER_1';
  } else if (estShelfLifeHours <= 72 || decayScore >= 35) {
    return 'TIER_2';
  } else {
    return 'TIER_3';
  }
}

/**
 * Evaluates dynamic discount percentage for flash sale rescue based on decay score & overproduction margin.
 */
export function calculateFlashDiscount(decayScore: number, surplusMarginPct: number): number {
  // Base discount from decay severity
  let discount = Math.min(60, Math.floor(decayScore * 0.6));
  // Additional overproduction clearance boost
  if (surplusMarginPct > 100) {
    discount += 15;
  } else if (surplusMarginPct > 50) {
    discount += 10;
  }
  return Math.min(75, Math.max(20, discount));
}
