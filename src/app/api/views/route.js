import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const views = await kv.get('pageViews') || 0;
    return Response.json({ views });
  } catch (error) {
    console.error('Error fetching views:', error);
    return Response.json({ views: 0, error: 'Failed to fetch views' });
  }
}

export async function POST() {
  try {
    const views = await kv.incr('pageViews');
    return Response.json({ views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return Response.json({ views: 0, error: 'Failed to increment views' });
  }
} 