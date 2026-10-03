import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export async function getPublishedArchives() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase
    .from('event_archives')
    .select('*, events(title, description, event_date)')
    .eq('published', true)
    .order('event_date', { ascending: false });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getArchiveById(id) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: null };
  const { data: archive, error: archiveError } = await supabase
    .from('event_archives')
    .select('*, events(title, description, event_date)')
    .eq('id', id)
    .single();
    
  if (archiveError) return { success: false, error: archiveError.message };

  const { data: media, error: mediaError } = await supabase
    .from('event_archive_media')
    .select('*')
    .eq('archive_id', id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
    
  if (mediaError) return { success: false, error: mediaError.message };

  return { success: true, data: { ...archive, media } };
}

export async function getArchiveByEventId(eventId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: null };
  const { data, error } = await supabase
    .from('event_archives')
    .select('*')
    .eq('event_id', eventId)
    .maybeSingle();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getAllArchivesAdmin() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase
    .from('event_archives')
    .select('*, events(title, description, event_date)')
    .order('created_at', { ascending: false });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function upsertArchive(payload) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  const { data, error } = await supabase
    .from('event_archives')
    .upsert(payload, { onConflict: 'event_id' })
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function toggleArchivePublish(id, published) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  const { error } = await supabase
    .from('event_archives')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function uploadArchiveImage(file, path) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  const { data, error } = await supabase.storage.from('event-archives').upload(path, file, { upsert: true });
  if (error) return { success: false, error: error.message };
  const { data: publicUrlData } = supabase.storage.from('event-archives').getPublicUrl(path);
  return { success: true, url: publicUrlData.publicUrl, path };
}

export async function addArchiveMedia(payload) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  const { data, error } = await supabase
    .from('event_archive_media')
    .insert([payload])
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getArchiveMedia(archiveId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase
    .from('event_archive_media')
    .select('*')
    .eq('archive_id', archiveId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function deleteArchiveMedia(mediaId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false };
  const { error } = await supabase
    .from('event_archive_media')
    .delete()
    .eq('id', mediaId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

