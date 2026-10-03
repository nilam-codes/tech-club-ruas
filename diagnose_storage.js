import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');

async function diagnose() {
  const { data, error } = await supabase.storage.from('event-archives').list('winner');
  console.log('STORAGE FILES:', data, error);
}
diagnose();
