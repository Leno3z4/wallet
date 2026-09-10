const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function normalizeUsername(value: string) {
  return value.trim().replace(/^@/, '').toLowerCase();
}

export function isValidUsername(value: string) {
  return USERNAME_RE.test(value.trim().replace(/^@/, ''));
}

export function displayUsername(value: string) {
  return `@${value}`;
}
