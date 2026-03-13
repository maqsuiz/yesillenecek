import { NextResponse } from 'next/server';
import { fetchNewsData, saveArticles } from '@/lib/news';

export async function GET(request: Request) {
  // request is used to get searchParams
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get('key');
  
  if (authKey) {
     // potential check
  }

  // Basic security for cron job if needed
  // if (authKey !== process.env.CRON_SECRET) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const articles = await fetchNewsData();
    await saveArticles(articles);
    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Support POST for manual trigger
export async function POST() {
  try {
    const articles = await fetchNewsData();
    await saveArticles(articles);
    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
