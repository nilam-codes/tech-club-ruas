import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export async function getEventRegistrations(eventId) {
  if (!isSupabaseConfigured() || !supabase) return { data: [], error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function registerForEvent(eventId, studentId, registrationData, status = 'pending') {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('event_registrations')
    .insert([{ event_id: eventId, student_id: studentId, registration_data: registrationData, status }]);
  return { data: { success: !error }, error };
}

export async function updateRegistrationStatus(registrationId, status) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_registrations')
    .update({ status })
    .eq('id', registrationId)
    .select()
    .single();
  return { data, error };
}

export async function deleteRegistration(registrationId) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('event_registrations').delete().eq('id', registrationId);
  return { error };
}

export async function getEventTeams(eventId) {
  if (!isSupabaseConfigured() || !supabase) return { data: [], error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_teams')
    .select(`
      *,
      event_team_members (
        registration_id,
        role,
        event_registrations (*)
      )
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function createTeam(eventId, name) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_teams')
    .insert([{ event_id: eventId, name }])
    .select()
    .single();
  return { data, error };
}

export async function renameTeam(teamId, name) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_teams')
    .update({ name })
    .eq('id', teamId)
    .select()
    .single();
  return { data, error };
}

export async function deleteTeam(teamId) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.from('event_teams').delete().eq('id', teamId);
  return { error };
}

export async function addTeamMember(teamId, registrationId, role = null) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { data, error } = await supabase
    .from('event_team_members')
    .insert([{ team_id: teamId, registration_id: registrationId, role }])
    .select()
    .single();
  return { data, error };
}

export async function removeTeamMember(teamId, registrationId) {
  if (!isSupabaseConfigured() || !supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase
    .from('event_team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('registration_id', registrationId);
  return { error };
}

