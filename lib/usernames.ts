export const USERNAME_MIN = 3;
export const USERNAME_MAX = 24;

export function normalizeUsername(input: string) {
  return input.trim().normalize('NFKC').toLowerCase();
}

export function validateUsername(input: string) {
  const normalized = normalizeUsername(input);
  if (normalized.length < USERNAME_MIN || normalized.length > USERNAME_MAX) {
    return { ok: false, normalized, error: `Username must be ${USERNAME_MIN}-${USERNAME_MAX} characters.` };
  }
  if (!/^[a-z0-9_]+$/.test(normalized)) {
    return { ok: false, normalized, error: 'Use letters, numbers, and underscores only.' };
  }
  return { ok: true, normalized, error: '' };
}
