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

    // Get all unique tags
    const tags = await BlogService.getAllTags();
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return NextResponse.json({ error: 'Failed to fetch blog tags' }, { status: 500 });
  }
}