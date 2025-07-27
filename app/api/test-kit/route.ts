import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const KIT_API_KEY = process.env.KIT_API_KEY;

    if (!KIT_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    console.log('Testing Kit APIs...');
    console.log('API Key length:', KIT_API_KEY.length);

    // Try Kit V4 API first
    let response = await fetch('https://api.kit.com/v4/account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_KEY,
      },
    });

    let data = await response.json();

    console.log('Kit V4 Account Test Response:', response.status, data);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Kit V4 API key is working! 🎉',
        api_version: 'V4',
        account: data.name || data.account?.name || 'Account found',
        plan: data.plan || 'Plan info not available',
        status: response.status
      });
    }

    // If V4 fails with 401, try V3 API as fallback
    if (response.status === 401) {
      console.log('V4 API key invalid, trying V3 API as fallback...');
      
      response = await fetch(`https://api.convertkit.com/v3/account?api_secret=${KIT_API_KEY}`);
      data = await response.json();

      console.log('Kit V3 Account Test Response:', response.status, data);

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Kit V3 API secret is working! 🎉',
          api_version: 'V3',
          account: data.name || 'Account found',
          plan: data.plan || 'Plan info not available',
          status: response.status
        });
      }
    }

    // Handle specific error cases for the final response
    if (response.status === 401) {
      return NextResponse.json({
        success: false,
        error: 'Invalid API key/secret - Neither V4 nor V3 API keys work',
        details: data,
        status: response.status
      }, { status: 401 });
    }

    if (response.status === 403) {
      return NextResponse.json({
        success: false,
        error: 'API access forbidden - Your Kit plan may not support API access',
        details: data,
        status: response.status
      }, { status: 403 });
    }

    return NextResponse.json({
      success: false,
      error: 'API key test failed for both V4 and V3',
      details: data,
      status: response.status
    }, { status: response.status });

  } catch (error) {
    console.error('Kit API test error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error.message 
    }, { status: 500 });
  }
}