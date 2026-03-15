const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  }
});

async function debugRSS() {
  const urls = [
    'https://www.theguardian.com/environment/rss',
    'https://www.carbonbrief.org/feed/'
  ];
  for (const url of urls) {
    console.log('--- Fetching:', url, '---');
    try {
      const feed = await parser.parseURL(url);
      const item = feed.items[0];
      console.log('Keys:', Object.keys(item));
      console.log('Enclosure:', item.enclosure);
      console.log('Media Content:', item['media:content']);
      console.log('Content Start:', item.content ? item.content.substring(0, 300) : 'None');
    } catch (e) {
      console.error(e);
    }
  }
}

debugRSS();
