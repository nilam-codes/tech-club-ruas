import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
async function test() {
  const { data, error } = await supabase.from('events').select('*');
  console.log(data, error);
}
test();
