import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { EVENTS_LIST, UPCOMING_FLAGSHIP_EVENT } from '../data/eventsData.js';

/**
 * Service to fetch events from Supabase with safe fallback to local data.
 * Keeps UI components isolated from direct database queries.
 */

export async function getEvents() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: EVENTS_LIST, error: null, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.warn('[eventsService] Supabase fetch error, falling back to static data:', error.message);
      return { data: EVENTS_LIST, error, isFallback: true };
    }

    if (!data || data.length === 0) {
      return { data: EVENTS_LIST, error: null, isFallback: true };
    }

    return { data, error: null, isFallback: false };
  } catch (err) {
    console.error('[eventsService] Unexpected error while fetching events:', err);
    return { data: EVENTS_LIST, error: err, isFallback: true };
  }
}

export async function getUpcomingFlagshipEvent() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: UPCOMING_FLAGSHIP_EVENT, error: null, isFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('event_date', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { data: UPCOMING_FLAGSHIP_EVENT, error: null, isFallback: true };
    }

    return { data, error: null, isFallback: false };
  } catch (err) {
    console.error('[eventsService] Error fetching flagship event:', err);
    return { data: UPCOMING_FLAGSHIP_EVENT, error: err, isFallback: true };
  }
}
