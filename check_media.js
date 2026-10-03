import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');

async function check() {
  const { data: media } = await supabase.from('event_archive_media').select('*');
  console.log('MEDIA:', media);
}
check();
