import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear the authentication cookie
  cookies().delete('admin_token');
  
  return NextResponse.json({ success: true });
}