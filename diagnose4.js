import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');

async function diagnose() {
  const { data: archives, error } = await supabase.from('event_archives').select('*');
  console.log('ARCHIVES:', archives, error);
}
diagnose();
