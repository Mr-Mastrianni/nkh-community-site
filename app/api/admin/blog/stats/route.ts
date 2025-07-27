import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blogService';
import { AuthService } from '@/lib/services/authService';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await AuthService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get blog statistics
    const stats = await BlogService.getBlogStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return NextResponse.json({ error: 'Failed to fetch blog statistics' }, { status: 500 });
  }
}