const fs = require('fs');
let content = fs.readFileSync('src/services/gameService.js', 'utf8');

const replacement = \    await supabase.from('rounds').insert([
      { event_id: EVENT_ID, round_number: 1, title: 'ROUND 1 - THE WORST SUPERHERO', status: 'locked' },
      { event_id: EVENT_ID, round_number: 2, title: 'ROUND 2 - GOVERNMENT ANNOUNCEMENT', status: 'locked' },
      { event_id: EVENT_ID, round_number: 3, title: 'ROUND 3 - FINAL COOKING', status: 'locked' }
    ]);
  }
  
  export async function getPublicEventState(eventId = EVENT_ID) {
    if (!isSupabaseConfigured() || !supabase) return { success: false, isCompleted: false };
    
    const { data, error } = await supabase
      .from('rounds')
      .select('status')
      .eq('event_id', eventId)
      .eq('round_number', 3)
      .single();
      
    if (error || !data) return { success: false, isCompleted: false };
    return { success: true, isCompleted: data.status === 'completed' };
  }\;

content = content.replace(/    await supabase\.from\('rounds'\)\.insert\(\[\s*\{ event_id: EVENT_ID, round_number: 1, title: 'ROUND 1 - THE WORST SUPERHERO', status: 'locked' \},\s*\{ event_id: EVENT_ID, round_number: 2, title: 'ROUND 2 - GOVERNMENT ANNOUNCEMENT', status: 'locked' \},\s*\{ event_id: EVENT_ID, round_number: 3, title: 'ROUND 3 - FINAL COOKING', status: 'locked' \}\s*\]\);\s*\}/g, replacement);

fs.writeFileSync('src/services/gameService.js', content);
