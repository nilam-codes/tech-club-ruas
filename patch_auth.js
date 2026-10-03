const fs = require('fs');
let content = fs.readFileSync('src/services/authService.js', 'utf8');

const newMethods = \
export async function sendPasswordResetEmail(email) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, error: 'Backend is offline.' };
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/#admin/reset-password',
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updatePassword(newPassword) {
  if (!isSupabaseConfigured() || !supabase) return { success: false, error: 'Backend is offline.' };

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
\;

content += newMethods;
fs.writeFileSync('src/services/authService.js', content);
