import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { UPCOMING_FLAGSHIP_EVENT } from '../data/eventsData.js';

const EVENT_ID = UPCOMING_FLAGSHIP_EVENT.id;

// ==========================================
// TEAMS
// ==========================================
export async function getTeams() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase.from('teams').select('*, team_members(registration_id)').eq('event_id', EVENT_ID).order('created_at', { ascending: true });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createTeam(teamName, teamCode) {
  const { data, error } = await supabase.from('teams').insert([{ event_id: EVENT_ID, team_name: teamName, team_code: teamCode }]).select().single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function assignMemberToTeam(teamId, registrationId) {
  const { error } = await supabase.from('team_members').insert([{ team_id: teamId, registration_id: registrationId }]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function removeMemberFromTeam(teamId, registrationId) {
  const { error } = await supabase.from('team_members').delete().match({ team_id: teamId, registration_id: registrationId });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function authenticateTeam(teamName, teamCode) {
  const { data, error } = await supabase.from('teams').select('*, team_members(registration_id)').eq('event_id', EVENT_ID).eq('team_name', teamName).eq('team_code', teamCode).single();
  if (error || !data) return { success: false, error: 'Invalid team name or code.' };

  const { data: participants, error: pError } = await supabase.rpc('get_team_participants', {
    p_team_id: data.id,
    p_team_code: teamCode
  });

  if (!pError && participants) {
    data.team_members = data.team_members.map(tm => {
      const p = participants.find(part => part.registration_id === tm.registration_id);
      if (p) {
        tm.registrations = { full_name: p.full_name };
      }
      return tm;
    });
  }

  return { success: true, data };
}

// ==========================================
// ROUNDS
// ==========================================
export async function getRounds() {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase.from('rounds').select('*').eq('event_id', EVENT_ID).order('round_number', { ascending: true });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateRoundStatus(roundId, status) {
  const { error } = await supabase.from('rounds').update({ status }).eq('id', roundId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function initializeRoundsIfEmpty() {
  if (!isSupabaseConfigured() || !supabase) return;
  const { data } = await supabase.from('rounds').select('id').eq('event_id', EVENT_ID);
  if (data && data.length > 0) return;
  
  await supabase.from('rounds').insert([
    { event_id: EVENT_ID, round_number: 1, title: 'ROUND 1 - THE WORST SUPERHERO', status: 'locked' },
    { event_id: EVENT_ID, round_number: 2, title: 'ROUND 2 - GOVERNMENT ANNOUNCEMENT', status: 'locked' },
    { event_id: EVENT_ID, round_number: 3, title: 'ROUND 3 - FINAL COOKING', status: 'locked' }
  ]);
}

// ==========================================
// SUBMISSIONS & VOTES
// ==========================================
export async function getSubmissions(roundId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase.from('submissions').select('*, teams(team_name)').eq('round_id', roundId);
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function getVotes(roundId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase.from('votes').select('*').eq('round_id', roundId);
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function submitEntry(payload) {
  const { error } = await supabase.rpc('submit_game_entry', {
    p_round_id: payload.round_id,
    p_team_id: payload.team_id,
    p_image_path: payload.image_path || null,
    p_hero_name: payload.hero_name || null,
    p_superpower: payload.superpower || null,
    p_description: payload.description || null,
    p_chosen_option: payload.chosen_option || null,
    p_interpretation_1: payload.interpretation_1 || null,
    p_interpretation_2: payload.interpretation_2 || null,
    p_interpretation_3: payload.interpretation_3 || null,
    p_opposing_instruction_1: payload.opposing_instruction_1 || null,
    p_opposing_instruction_2: payload.opposing_instruction_2 || null
  });
  if (error) {
    if (error.code === '23505' || error.message?.includes('duplicate key value') || error.message?.includes('unique_submission_per_team_round')) {
      return { success: false, error: 'SUBMISSION ALREADY LOCKED\n\nYour team has already submitted for this round.' };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function submitVote(roundId, voterRegistrationId, submissionId, score) {
  const { error } = await supabase.rpc('submit_game_vote', {
    p_round_id: roundId,
    p_voter_registration_id: voterRegistrationId,
    p_submission_id: submissionId,
    p_score: score
  });
  if (error) {
    if (error.code === '23505' || error.message?.includes('duplicate key value') || error.message?.includes('unique_vote_per_participant_submission')) {
      return { success: false, error: 'VOTE ALREADY CAST' };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getMyVotes(teamId, teamCode, registrationId, roundId) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, data: [] };
  const { data, error } = await supabase.rpc('get_my_votes', {
    p_team_id: teamId,
    p_team_code: teamCode,
    p_registration_id: registrationId,
    p_round_id: roundId
  });
  if (error) return { success: false, error: error.message };
  return { success: true, data: data.map(v => v.submission_id) };
}

export async function uploadImage(file, path) {
  const { data, error } = await supabase.storage.from('cooked-without-code').upload(path, file);
  if (error) return { success: false, error: error.message };
  const { data: publicUrlData } = supabase.storage.from('cooked-without-code').getPublicUrl(path);
  return { success: true, url: publicUrlData.publicUrl, path };
}

export async function deleteImage(path) {
  if (!isSupabaseConfigured() || !supabase) return;
  await supabase.storage.from('cooked-without-code').remove([path]);
}
