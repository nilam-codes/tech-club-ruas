import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');

async function check() {
  const { data: archives } = await supabase.from('event_archives').select('id, title, winner_photo_url, snapshot_scoreboard, snapshot_teams');
  console.log('ARCHIVES:', JSON.stringify(archives, null, 2));
}
check();
