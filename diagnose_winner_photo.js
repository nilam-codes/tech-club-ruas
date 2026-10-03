import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vkhyiisrfutwmdvfbggh.supabase.co', 'sb_publishable_5DpGKKJeg1dFuVcVVtl60g__IxeSUIl');
const EVENT_ID = '6c6718bf-12b8-4b2a-a172-52d62fe4250f';

async function diagnose() {
  console.log('--- 1. EVENT ARCHIVES ---');
  const { data: archive, error: archError } = await supabase
    .from('event_archives')
    .select('id, event_id, winner_photo_url, published')
    .eq('event_id', EVENT_ID)
    .single();
    
  if (archError) {
    console.error('Error fetching archive:', archError);
    return;
  }
  console.log(archive);

  console.log('\n--- 2. EVENT ARCHIVE MEDIA ---');
  const { data: media, error: mediaError } = await supabase
    .from('event_archive_media')
    .select('*')
    .eq('archive_id', archive.id)
    .eq('media_type', 'winner_photo');
    
  if (mediaError) {
    console.error('Error fetching media:', mediaError);
  } else {
    console.log(media);
  }

  console.log('\n--- 3. STORAGE ---');
  if (media && media.length > 0) {
    const url = media[0].image_url;
    console.log('Image URL:', url);
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log('Fetch Status:', res.status, res.ok ? 'OK' : 'FAILED');
    } catch (e) {
      console.log('Fetch Error:', e.message);
    }
  } else {
    console.log('No winner_photo media row exists.');
  }
}
diagnose();
