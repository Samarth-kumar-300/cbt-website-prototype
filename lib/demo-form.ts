// lib/demo-form.ts
import { validateFields, type Field } from '@/lib/contact-form';
import { parsePlan, type Plan } from './demo-plan';

export const ROLE_OPTIONS = ['Therapist', 'Parent', 'Therapy centre admin', 'School', 'Other'] as const;
export const USER_OPTIONS = ['1', '2', '3', '4', '5', '6 or more'] as const;
const MORE_USERS = '6 or more';
const ORG_ROLES: readonly string[] = ['Therapy centre admin', 'School'];
const OTHER_ROLE = 'Other';

export { parsePlan };
export type { Plan };

export type DemoValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  /** What the visitor typed when they chose "Other". Empty for any other role. */
  roleOther: string;
  organisation: string;
  users: string;
  /** Honeypot: real visitors never see this field, so it stays empty. */
  website: string;
  /** What the visitor typed for "Enter code shown". Checked for presence only and never sent. */
  captcha: string;
};

export type DemoRequest = {
  name: string;
  email: string;
  phone: string;
  role: string;
  /** The visitor's own words when role is "Other", otherwise an empty string. */
  roleOther: string;
  organisation: string;
  users: string;
  plan: Plan | null;
};

export const EMPTY_DEMO: DemoValues = { name: '', email: '', phone: '', role: '', roleOther: '', organisation: '', users: '', website: '', captcha: '' };

export function initialValues(plan: Plan | null): DemoValues {
  return { ...EMPTY_DEMO, users: plan === 'custom' ? MORE_USERS : '' };
}

/** "Other" asks the visitor to say what they are. */
export function showsRoleOther(role: string): boolean {
  return role === OTHER_ROLE;
}

export function showsOrganisation(role: string): boolean {
  return ORG_ROLES.includes(role);
}

// "Your role" and "Number of users" are the names used in error messages; the visible labels are "I am a" and "How many users".
const FIELDS: Field[] = [
  { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 120 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', label: 'Phone number', type: 'tel', required: true, maxLength: 20 },
  { name: 'role', label: 'Your role', type: 'select', required: true },
  { name: 'users', label: 'Number of users', type: 'select', required: true },
];
const ROLE_OTHER_FIELD: Field = { name: 'roleOther', label: 'Your role', type: 'text', required: false, maxLength: 80 };
const ORG_FIELD: Field = { name: 'organisation', label: 'Centre or school name', type: 'text', required: false, maxLength: 120 };

export function validateDemo(values: DemoValues): Record<string, string> {
  const fields = [...FIELDS, ...(showsOrganisation(values.role) ? [ORG_FIELD] : []), ...(showsRoleOther(values.role) ? [ROLE_OTHER_FIELD] : [])];
  const errors = validateFields(values, fields);
  if (showsRoleOther(values.role) && !values.roleOther.trim()) errors.roleOther = 'Tell us your role';
  if (!values.captcha.trim()) errors.captcha = 'Enter the code shown';
  if (!errors.phone && values.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number';
  return errors;
}

export function toRequest(values: DemoValues, dialCode: string, plan: Plan | null): DemoRequest {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: `${dialCode} ${values.phone.trim()}`,
    role: values.role,
    roleOther: showsRoleOther(values.role) ? values.roleOther.trim() : '',
    organisation: showsOrganisation(values.role) ? values.organisation.trim() : '',
    users: values.users,
    plan,
  };
}

export function isSpam(values: DemoValues): boolean {
  return values.website.trim() !== '';
}

export function usersHelper(plan: Plan | null, users: string): string {
  if (users === MORE_USERS) return 'Custom pricing applies.';
  if (plan === 'basic') return 'Basic: up to 5 users, ₹2,000 each.';
  return '';
}
