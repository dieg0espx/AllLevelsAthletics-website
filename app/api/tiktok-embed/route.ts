import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Fetch oEmbed data from TikTok
    const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`TikTok API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Try to extract video URL from the embed HTML
    const videoUrlMatch = data.html?.match(/src="([^"]+)"/);
    const videoUrl = videoUrlMatch ? videoUrlMatch[1] : null;
    
    return NextResponse.json({
      ...data,
      videoUrl: videoUrl
    });
  } catch (error) {
    console.error('Error fetching TikTok oEmbed data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TikTok data' }, 
      { status: 500 }
    );
  }
}
