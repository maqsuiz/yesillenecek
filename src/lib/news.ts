import Parser from 'rss-parser';
import { supabaseAdmin } from './supabase';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
    ],
  }
});


export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  image_url: string | null;
  source: string;
  published_at: string;
  category: string;
  language: string;
}

const NEWS_DATA_API_KEY = process.env.NEWS_DATA_API_KEY;
const KEYWORDS = "sürdürülebilirlik OR iklim değişikliği OR karbon ayak izi OR doğa yeşillenmesi OR 'sıfır atık' OR 'yeşil dünya' OR 'yenilenebilir enerji' OR sustainability OR 'climate change' OR 'carbon footprint' OR reforestation OR 'nature greening' OR 'zero waste' OR 'green world' OR 'renewable energy' OR 'circular economy' OR 'carbon sequestration'";

const RSS_FEEDS = [
  { url: 'https://yesilgazete.org/feed/', source: 'Yeşil Gazete', lang: 'tr' },
  { url: 'https://www.iklimhaber.org/feed/', source: 'İklim Haber', lang: 'tr' },
  { url: 'https://www.theguardian.com/environment/rss', source: 'The Guardian', lang: 'en' },
  { url: 'https://www.carbonbrief.org/feed/', source: 'Carbon Brief', lang: 'en' },
  { url: 'https://e360.yale.edu/feed', source: 'Yale E360', lang: 'en' },
  { url: 'https://www.treehugger.com/feeds/all/', source: 'Treehugger', lang: 'en' },
];


export async function fetchNewsData() {
  const articles: NewsArticle[] = [];

  // 1. Fetch from NewsData.io
  if (NEWS_DATA_API_KEY) {
    try {
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${NEWS_DATA_API_KEY}&q=${encodeURIComponent(KEYWORDS)}&language=tr,en`
      );
      const data = await response.json();

      if (data.results) {
        data.results.forEach((item: { title: string; description?: string; content?: string; link: string; image_url: string; source_id: string; pubDate: string; language: string; }) => {
          articles.push({
            title: item.title,
            summary: item.description || item.content || '',
            url: item.link,
            image_url: item.image_url,
            source: item.source_id,
            published_at: item.pubDate,
            category: determineCategory(item.title + ' ' + (item.description || '')),
            language: item.language,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching NewsData.io:', error);
    }
  }

  // 2. Fetch from RSS Feeds
  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      feedData.items.forEach((item) => {
        articles.push({
          title: item.title || '',
          summary: item.contentSnippet || item.content || '',
          url: item.link || '',
          image_url: extractImageUrl(item),
          source: feed.source,
          published_at: item.pubDate || new Date().toISOString(),
          category: determineCategory((item.title || '') + ' ' + (item.contentSnippet || '')),
          language: feed.lang,
        });
      });
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.source}:`, error);
    }
  }

  return articles;
}

function determineCategory(text: string): string {
  const t = text.toLowerCase();
  
  if (t.includes('karbon') || t.includes('carbon') || t.includes('emisyon') || t.includes('emission')) {
    return 'Karbon';
  }
  
  if (
    t.includes('doğa') || 
    t.includes('nature') || 
    t.includes('reforestation') || 
    t.includes('yeşil dünya') || 
    t.includes('green world') ||
    t.includes('orman') ||
    t.includes('forest')
  ) {
    return 'Doğa Yeşillenmesi';
  }
  
  if (
    t.includes('iklim') || 
    t.includes('climate') || 
    t.includes('ısınma') || 
    t.includes('warming')
  ) {
    return 'İklim';
  }
  
  if (
    t.includes('atık') || 
    t.includes('waste') || 
    t.includes('recycling') || 
    t.includes('geri dönüşüm') ||
    t.includes('döngüsel') ||
    t.includes('circular')
  ) {
    return 'Sürdürülebilirlik'; // Could also be a 'Sıfır Atık' category, but keeping it under Sustainability for now or as requested.
  }

  return 'Sürdürülebilirlik';
}

interface MediaRSSField {
  $: { 
    url: string;
    width?: string | number;
    height?: string | number;
  };
  [key: string]: unknown;
}

function cleanImageUrl(url: string | null): string | null {
  if (!url) return null;
  
  // The Guardian images (i.guim.co.uk) are signed. 
  // Modifying parameters like width/quality invalidates the signature 's='.
  if (url.includes('i.guim.co.uk')) {
    // Only attempt to swap width if it's clearly a low-res thumbnail and we can find a better version,
    // otherwise return original to avoid 401 Invalid Signature errors.
    if (url.includes('width=140') && !url.includes('&s=')) {
       return url.replace('width=140', 'width=1200');
    }
    return url; 
  }

  // Generic cleaning for other potentially unsigned providers
  if (url.includes('?')) {
    const [base, params] = url.split('?');
    // If it's a thumbnail-specific param without a visible signature, try cleaning
    if ((params.includes('w=') || params.includes('width=')) && !params.includes('sig=') && !params.includes('s=')) {
        return base; // Try stripping params entirely for many WordPress/CDN setups
    }
  }

  return url;
}

function extractImageUrl(item: {
  enclosure?: { url: string };
  'media:content'?: MediaRSSField | MediaRSSField[];
  'media:thumbnail'?: MediaRSSField | MediaRSSField[];
  content?: string;
  contentSnippet?: string;
}): string | null {
  const candidates: { url: string; width: number }[] = [];

  // 1. Helper to add candidates from media fields
  const addCandidates = (field: MediaRSSField | MediaRSSField[] | undefined) => {
    if (!field) return;
    const items = Array.isArray(field) ? field : [field];
    items.forEach(item => {
      if (item.$ && item.$.url) {
        const width = parseInt(String(item.$.width || '0'), 10);
        candidates.push({ url: item.$.url, width });
      }
    });
  };

  // 2. Collect all potential images
  if (item.enclosure && item.enclosure.url) {
    candidates.push({ url: item.enclosure.url, width: 0 });
  }

  addCandidates(item['media:content']);
  addCandidates(item['media:thumbnail']);

  // 3. Try parsing from content as last resort
  if (candidates.length === 0) {
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      candidates.push({ url: imgMatch[1], width: 0 });
    }
  }

  if (candidates.length === 0) return null;

  // 4. Sort by width descending and pick the best
  // If widths are 0 (unknown), it will just pick the first one found
  candidates.sort((a, b) => b.width - a.width);
  
  const bestUrl = candidates[0].url;
  return cleanImageUrl(bestUrl);
}

export async function saveArticles(articles: NewsArticle[]) {
  if (!supabaseAdmin) {
    console.warn('Skipping saveArticles: Supabase Admin client not initialized (missing environment variables).');
    return;
  }

  for (const article of articles) {
    const { error } = await supabaseAdmin
      .from('news_articles')
      .upsert(
        {
          title: article.title,
          summary: article.summary,
          url: article.url,
          image_url: article.image_url,
          source: article.source,
          published_at: article.published_at,
          category: article.category,
          language: article.language,
        },
        { onConflict: 'url' }
      );

    if (error) {
      console.error('Error saving article:', article.url, error);
    }
  }
}
