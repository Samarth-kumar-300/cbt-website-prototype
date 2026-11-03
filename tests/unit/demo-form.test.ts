import { describe, expect, it } from 'vitest';
import {
  EMPTY_DEMO,
  initialValues,
  isSpam,
  parsePlan,
  showsOrganisation,
  toRequest,
  usersHelper,
  validateDemo,
  type DemoValues,
} from '@/lib/demo-form';

const valid: DemoValues = { ...EMPTY_DEMO, name: 'Asha Rao', email: 'asha@example.com', phone: '9876543210', role: 'Parent', users: '2' };

describe('parsePlan', () => {
  it('accepts exactly basic and custom', () => {
    expect(parsePlan('basic')).toBe('basic');
    expect(parsePlan('custom')).toBe('custom');
  });
  it('rejects anything else without throwing', () => {
    for (const v of [undefined, null, '', 'BASIC', ' basic', 'pro', 'basic ', [], ['nope']]) {
      expect(parsePlan(v as string | string[] | null | undefined), String(v)).toBeNull();
    }
  });
  it('uses the first value when the parameter is repeated', () => {
    expect(parsePlan(['custom', 'basic'])).toBe('custom');
  });
});

describe('initialValues', () => {
  it('preselects "6 or more" for the custom plan only', () => {
    expect(initialValues('custom').users).toBe('6 or more');
    expect(initialValues('basic').users).toBe('');
    expect(initialValues(null).users).toBe('');
  });
});

describe('showsOrganisation', () => {
  it('is true for centre admins and schools only', () => {
    expect(showsOrganisation('Therapy centre admin')).toBe(true);
    expect(showsOrganisation('School')).toBe(true);
    for (const r of ['Therapist', 'Parent', 'Other', '']) expect(showsOrganisation(r), r).toBe(false);
  });
});

describe('validateDemo', () => {
  it('accepts a complete parent request', () => {
    expect(validateDemo(valid)).toEqual({});
  });
  it('asks for every required field on an empty form, and not for the school name', () => {
    expect(validateDemo(EMPTY_DEMO)).toEqual({
      name: 'Name is required',
      email: 'Email is required',
      phone: 'Phone number is required',
      role: 'Your role is required',
      users: 'Number of users is required',
    });
  });
  it('rejects a bad email and a phone number with too few digits', () => {
    expect(validateDemo({ ...valid, email: 'asha@' }).email).toBe('Enter a valid email address');
    expect(validateDemo({ ...valid, phone: '12 34' }).phone).toBe('Enter a valid phone number');
    expect(validateDemo({ ...valid, phone: '98765 43210' }).phone).toBeUndefined();
  });
  it('checks the school name length only when the role shows that field', () => {
    const long = 'x'.repeat(121);
    expect(validateDemo({ ...valid, role: 'School', organisation: long }).organisation).toBe('Centre or school name must be 120 characters or fewer');
    expect(validateDemo({ ...valid, role: 'Parent', organisation: long }).organisation).toBeUndefined();
  });
});

describe('toRequest', () => {
  it('trims values and joins the dial code and phone', () => {
    const r = toRequest({ ...valid, name: '  Asha Rao ', email: ' asha@example.com ', phone: ' 9876543210 ' }, '+91', 'basic');
    expect(r).toEqual({ name: 'Asha Rao', email: 'asha@example.com', phone: '+91 9876543210', role: 'Parent', organisation: '', users: '2', plan: 'basic' });
  });
  it('drops a school name typed earlier when the role no longer shows that field', () => {
    expect(toRequest({ ...valid, role: 'Parent', organisation: 'Sunrise School' }, '+91', null).organisation).toBe('');
    expect(toRequest({ ...valid, role: 'School', organisation: ' Sunrise School ' }, '+91', null).organisation).toBe('Sunrise School');
  });
});

describe('isSpam', () => {
  it('flags a filled honeypot and ignores whitespace', () => {
    expect(isSpam({ ...valid, website: 'http://spam.example' })).toBe(true);
    expect(isSpam({ ...valid, website: '   ' })).toBe(false);
    expect(isSpam(valid)).toBe(false);
  });
});

describe('usersHelper', () => {
  const confirm = 'We’ll confirm the exact count in your demo.';
  it('always ends with the confirmation line', () => {
    expect(usersHelper(null, '')).toBe(confirm);
  });
  it('shows the Basic price when the Basic plan was chosen', () => {
    expect(usersHelper('basic', '')).toBe(`Basic: up to 5 users, ₹2,000 each. ${confirm}`);
  });
  it('says custom pricing applies for 6 or more, whatever the plan', () => {
    expect(usersHelper('custom', '6 or more')).toBe(`Custom pricing applies. ${confirm}`);
    expect(usersHelper('basic', '6 or more')).toBe(`Custom pricing applies. ${confirm}`);
  });
});
