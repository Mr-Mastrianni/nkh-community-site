import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email } = await request.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const KIT_API_KEY = process.env.KIT_API_KEY;

    if (!KIT_API_KEY) {
      console.error('Kit API key not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Trying Kit V4 API first...');
    console.log('API Key length:', KIT_API_KEY.length);

    // Try Kit V4 API first
    let subscriberResponse = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_KEY,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName || '',
        last_name: lastName || '',
        state: 'active',
      }),
    });

    let subscriberData = await subscriberResponse.json();

    console.log('Kit V4 API Response Status:', subscriberResponse.status);
    console.log('Kit V4 API Response:', subscriberData);

    // If V4 works, return success
    if (subscriberResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter! 🌟 (V4 API)',
        subscriber: subscriberData.subscriber
      });
    }

    // If V4 fails with 401 (invalid key), try V3 API as fallback
    if (subscriberResponse.status === 401) {
      console.log('V4 API key invalid, trying V3 API as fallback...');
      
      subscriberResponse = await fetch('https://api.convertkit.com/v3/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: KIT_API_KEY, // V3 uses api_secret
          email: email,
          first_name: firstName || '',
          last_name: lastName || '',
        }),
      });

      subscriberData = await subscriberResponse.json();

      console.log('Kit V3 API Response Status:', subscriberResponse.status);
      console.log('Kit V3 API Response:', subscriberData);

      if (subscriberResponse.ok) {
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter! 🌟 (V3 API)',
          subscriber: subscriberData.subscription
        });
      }
    }

    // Handle specific Kit V4 API errors
    if (subscriberResponse.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Kit V4 API key.' },
        { status: 401 }
      );
    }

    if (subscriberResponse.status === 403) {
      return NextResponse.json(
        { error: 'API access not allowed. Check your Kit plan supports API access.' },
        { status: 403 }
      );
    }

    if (subscriberResponse.status === 422) {
      // Handle validation errors
      const errorMessage = subscriberData.errors?.email_address?.[0] || 
                          subscriberData.message || 
                          'Email validation failed';
      
      if (errorMessage.includes('taken') || errorMessage.includes('already exists')) {
        return NextResponse.json(
          { error: 'This email is already subscribed to the newsletter.' },
          { status: 422 }
        );
      }
      
      return NextResponse.json(
        { error: `Validation error: ${errorMessage}` },
        { status: 422 }
      );
    }

    if (subscriberResponse.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    // Generic error handling
    return NextResponse.json(
      { 
        error: `Kit API error: ${subscriberData?.message || subscriberData?.error || 'Unknown error'}`,
        details: subscriberData
      },
      { status: subscriberResponse.status }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}