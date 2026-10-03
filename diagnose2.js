import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
const EVENT_ID = '6c6718bf-12b8-4b2a-a172-52d62fe4250f';

async function diagnose() {
  const { data: event } = await supabase.from('events').select('*').eq('id', EVENT_ID);
  console.log('EVENT:', event);
  
  const { data: archives } = await supabase.from('event_archives').select('id, event_id, published');
  console.log('ALL ARCHIVES:', archives);
}
diagnose();
