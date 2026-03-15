const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('news_articles')
    .select('title, image_url, source')
    .not('image_url', 'is', null)
    .limit(5);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Results with images:', data.length);
    data.forEach(d => console.log(`- [${d.source}] ${d.title}: ${d.image_url}`));
  }
  
  const { count } = await supabase
    .from('news_articles')
    .select('*', { count: 'exact', head: true });
  console.log('Total articles:', count);
}

check();
