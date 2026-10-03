import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
async function test() {
  const { data, error } = await supabase
    .from('event_archives')
    .select('*, events(title, description, event_date)')
    .eq('published', true)
    .order('event_date', { ascending: false, referencedTable: 'events' });
  console.log(data, error);
}
test();
