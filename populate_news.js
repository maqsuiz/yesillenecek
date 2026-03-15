const { createClient } = require('@supabase/supabase-js');
const Parser = require('rss-parser');
require('dotenv').config({ path: '.env.local' });

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
    ],
  }
});


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

const RSS_FEEDS = [
  { url: 'https://yesilgazete.org/feed/', source: 'Yeşil Gazete', lang: 'tr' },
  { url: 'https://www.iklimhaber.org/feed/', source: 'İklim Haber', lang: 'tr' },
  { url: 'https://www.theguardian.com/environment/rss', source: 'The Guardian', lang: 'en' },
  { url: 'https://www.carbonbrief.org/feed/', source: 'Carbon Brief', lang: 'en' },
  { url: 'https://e360.yale.edu/feed', source: 'Yale E360', lang: 'en' },
];


function determineCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('karbon') || t.includes('carbon')) return 'Karbon';
  if (t.includes('doğa') || t.includes('nature')) return 'Doğa Yeşillenmesi';
  if (t.includes('iklim') || t.includes('climate')) return 'İklim';
  return 'Sürdürülebilirlik';
}

function cleanImageUrl(url) {
  if (!url) return null;
  // The Guardian images (i.guim.co.uk) are signed. 
  // Modifying parameters like width/quality invalidates the signature 's='.
  if (url.includes('i.guim.co.uk')) {
    if (url.includes('width=140') && !url.includes('&s=')) {
       return url.replace('width=140', 'width=1200');
    }
    return url; 
  }
  return url;
}

function extractImageUrl(item) {
  const candidates = [];

  // Helper to add candidates from media fields
  const addCandidates = (field) => {
    if (!field) return;
    const items = Array.isArray(field) ? field : [field];
    items.forEach(item => {
      if (item.$ && item.$.url) {
        const width = parseInt(String(item.$.width || '0'), 10);
        candidates.push({ url: item.$.url, width });
      }
    });
  };

  if (item.enclosure && item.enclosure.url) {
    candidates.push({ url: item.enclosure.url, width: 0 });
  }

  addCandidates(item['media:content']);
  addCandidates(item['media:thumbnail']);

  if (candidates.length === 0) {
    const content = item.content || item.contentSnippet || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) candidates.push({ url: imgMatch[1], width: 0 });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.width - a.width);
  return cleanImageUrl(candidates[0].url);
}

async function populate() {
  console.log('Fetching news from RSS...');
  const articles = [];
  
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
      console.error(`Error fetching RSS feed ${feed.source}:`, error.message);
    }
  }


  console.log(`Saving ${articles.length} articles to Supabase...`);
  
  for (const article of articles) {
    const { error } = await supabaseAdmin
      .from('news_articles')
      .upsert(article, { onConflict: 'url' });

    if (error) {
      console.error('Error saving article:', article.url, error.message);
    }
  }
  
  console.log('Database population complete!');
}

populate();
