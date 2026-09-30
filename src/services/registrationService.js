import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

/**
 * Service to handle event registrations through Supabase.
 * Isolates UI forms from direct Supabase query logic.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationPayload(payload) {
  const {
    eventId,
    fullName,
    email,
    phone,
    college,
    course,
    year,
    studentId
  } = payload || {};

  if (!eventId) {
    return {
      valid: false,
      error: 'An associated event ID is required for registration.'
    };
  }

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return {
      valid: false,
      error: 'Full Name is required.'
    };
  }

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    return {
      valid: false,
      error: 'A valid email address is required.'
    };
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return {
      valid: false,
      error: 'Phone number is required.'
    };
  }

  if (!studentId || typeof studentId !== 'string' || !studentId.trim()) {
    return {
      valid: false,
      error: 'Student ID is required.'
    };
  }

  if (!college || typeof college !== 'string' || !college.trim()) {
    return {
      valid: false,
      error: 'College name is required.'
    };
  }

  if (!course || typeof course !== 'string' || !course.trim()) {
    return {
      valid: false,
      error: 'Course / Department is required.'
    };
  }

  if (!year || typeof year !== 'string' || !year.trim()) {
    return {
      valid: false,
      error: 'Year of study is required.'
    };
  }

  return {
    valid: true
  };
}

export async function submitEventRegistration(payload) {
  const validation = validateRegistrationPayload(payload);

  if (!validation.valid) {
    return {
      success: false,
      error: validation.error
    };
  }

  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error:
        'Backend is operating in offline mode. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to process registrations.'
    };
  }

  const {
    eventId,
    fullName,
    email,
    phone,
    college,
    course,
    year,
    studentId
  } = payload;

  try {
    const { error } = await supabase
      .from('registrations')
      .insert([
        {
          event_id: eventId,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          college: college.trim(),
          course: course.trim(),
          year: year.trim(),
          student_id: studentId.trim()
        }
      ]);

    if (error) {
      // Postgres error 23505: Unique violation
      // A student/email is already registered for this event.
      if (error.code === '23505') {
        return {
          success: false,
          error: 'This email is already registered for this event.'
        };
      }

      console.error(
        '[registrationService] Supabase insert error:',
        error
      );

      return {
        success: false,
        error:
          error.message ||
          'Failed to submit registration. Please try again later.'
      };
    }

    return {
      success: true
    };
  } catch (err) {
    console.error(
      '[registrationService] Unexpected registration exception:',
      err
    );

    return {
      success: false,
      error:
        'An unexpected connection error occurred. Please try again.'
    };
  }
}

export async function getRegistrationsForEvent(eventId) {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Backend is offline.' };
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[registrationService] Error fetching registrations:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('[registrationService] Unexpected fetch error:', err);
    return { success: false, error: 'Failed to fetch registrations.' };
  }
}