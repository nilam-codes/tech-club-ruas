import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
const EVENT_ID = '6c6718bf-12b8-4b2a-a172-52d62fe4250f';

async function debug() {
  const { data: regs, error } = await supabase.from('registrations').select('*').eq('event_id', EVENT_ID);
  console.log('REGS ERROR:', error);
  console.log('REGS DATA:', regs);
}
debug();
