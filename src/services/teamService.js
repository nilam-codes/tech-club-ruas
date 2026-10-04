import { supabase } from '../lib/supabaseClient';

// ---------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------

export async function getPublicTeamMembers() {
  const { data, error } = await supabase
    .from('public_club_team')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching public team members:', error);
    return [];
  }
  return data || [];
}

// ---------------------------------------------------------
// ADMIN API
// ---------------------------------------------------------

export async function getAdminTeamMembers() {
  const { data, error } = await supabase
    .from('club_team')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admin team members:', error);
    throw error;
  }
  return data || [];
}

export async function addTeamMember(memberData) {
  const { data, error } = await supabase
    .from('club_team')
    .insert([memberData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTeamMember(id, memberData) {
  const { data, error } = await supabase
    .from('club_team')
    .update(memberData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTeamMember(id) {
  const { error } = await supabase
    .from('club_team')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// STORAGE

export async function uploadTeamMemberPhoto(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('team-profiles')
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('team-profiles')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrlData.publicUrl
  };
}

export async function deleteTeamMemberPhoto(url) {
  if (!url) return;
  // Extract path from URL
  const parts = url.split('/team-profiles/');
  if (parts.length === 2) {
    const path = parts[1];
    await supabase.storage.from('team-profiles').remove([path]);
  }
}
