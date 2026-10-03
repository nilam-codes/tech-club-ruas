import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
const EVENT_ID = '6c6718bf-12b8-4b2a-a172-52d62fe4250f';

async function run() {
  const { data: teams } = await supabase.from('teams').select('*, team_members(registration_id)').eq('event_id', EVENT_ID);
  
  // Fake admin login to bypass RLS for registrations? I can't.
  // BUT we know regs returns null for anon. 
  // Wait! In the browser, the user is logged in as Admin. 
  
  console.log(teams.map(t => t.team_members));
}
run();
