const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing connection to:', supabaseUrl);
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('ERROR:', error.message);
    if (error.message.includes('relation "public.news_articles" does not exist')) {
        console.log('RESULT: TABLE_MISSING');
    }
  } else {
    console.log('RESULT: TABLE_EXISTS');
    console.log('Data:', data);
  }
}

test();
