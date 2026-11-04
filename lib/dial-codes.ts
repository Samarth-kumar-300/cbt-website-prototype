// lib/dial-codes.ts
/* Compact replacement for the captured intl-tel-input country list (~244 entries). */
export const DIAL_CODES = [
  { iso: 'IN', name: 'India', code: '+91' },
  { iso: 'US', name: 'United States', code: '+1' },
  { iso: 'GB', name: 'United Kingdom', code: '+44' },
  { iso: 'AE', name: 'United Arab Emirates', code: '+971' },
  { iso: 'SA', name: 'Saudi Arabia', code: '+966' },
  { iso: 'QA', name: 'Qatar', code: '+974' },
  { iso: 'SG', name: 'Singapore', code: '+65' },
  { iso: 'AU', name: 'Australia', code: '+61' },
  { iso: 'CA', name: 'Canada', code: '+1' },
  { iso: 'DE', name: 'Germany', code: '+49' },
] as const;
