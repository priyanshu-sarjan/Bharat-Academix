import { NextResponse } from 'next/server';
import { INITIAL_FLASH_OFFERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    status: 'SUCCESS',
    portal: 'Smart Farmer Rescue Flash Clearance Portal',
    count: INITIAL_FLASH_OFFERS.length,
    offers: INITIAL_FLASH_OFFERS,
  });
}
