import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { EVENTS_LIST, UPCOMING_FLAGSHIP_EVENT } from '../data/eventsData.js';

/**
 * Service to manage generic events.
 */

export async function getEvents(filters = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: EVENTS_LIST, error: null, isFallback: true };
  }

  try {
    let query = supabase.from('events').select('*');

    if (filters.club) {
      query = query.eq('club', filters.club);
    }
    
    // We only want to show non-draft events publicly, unless an admin is viewing
    if (!filters.isAdmin) {
      query = query.neq('lifecycle_status', 'DRAFT');
    }

    if (filters.status) {
      if (filters.status === 'upcoming') {
        query = query.in('lifecycle_status', ['REGISTRATION_OPEN', 'REGISTRATION_CLOSED']);
      } else if (filters.status === 'past') {
        query = query.in('lifecycle_status', ['COMPLETED', 'ARCHIVED']);
      } else if (filters.status === 'live') {
        query = query.eq('lifecycle_status', 'ONGOING');
      }
    }

    const { data, error } = await query.order('event_date', { ascending: true });

    if (error) {
      console.warn('[eventsService] Supabase fetch error, falling back to static data:', error.message);
      return { data: EVENTS_LIST, error, isFallback: true };
    }

    // Since we just migrated, some old events might lack `lifecycle_status` properly populated, but default is DRAFT. 
    // The CWC event has `status = 'upcoming'` or something. It might not show if we filter strictly by lifecycle_status.
    // Let's ensure CWC is returned if it matches.
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
  
  // Hack to ensure CWC is returned for the flagship, or we can fetch the most prominent upcoming tech event.
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', UPCOMING_FLAGSHIP_EVENT.id)
      .maybeSingle();

    if (error || !data) {
      return { data: UPCOMING_FLAGSHIP_EVENT, error: null, isFallback: true };
    }
    return { data, error: null, isFallback: false };
  } catch (err) {
    return { data: UPCOMING_FLAGSHIP_EVENT, error: err, isFallback: true };
  }
}

export async function getEventById(eventId) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: 'Supabase not configured' };
  }
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).maybeSingle();
  return { data, error };
}

export async function createEvent(eventData) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase.from('events').insert([eventData]).select().single();
  return { data, error };
}

export async function updateEvent(eventId, updates) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase.from('events').update(updates).eq('id', eventId).select().single();
  return { data, error };
}

export async function deleteEvent(eventId) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  return { error };
}

