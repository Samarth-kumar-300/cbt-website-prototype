// lib/demo-form.ts
import { validateFields, type Field } from '@/lib/contact-form';
import { parsePlan, type Plan } from './demo-plan';

export const ROLE_OPTIONS = ['Therapy Centres', 'Schools', 'Individual Therapists'] as const;
export const USER_OPTIONS = ['1', '2', '3', '4', '5', '6 or more'] as const;
const MORE_USERS = '6 or more';
const ORG_ROLES: readonly string[] = ['Therapy Centres', 'Schools'];

export { parsePlan };
export type { Plan };

export type DemoValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  organisation: string;
  users: string;
  /** Honeypot: real visitors never see this field, so it stays empty. */
  website: string;
  /** What the visitor typed for "Enter code shown". Checked for presence only and never sent. */
  captcha: string;
};

export type DemoRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  organisation: string;
  users: string;
  plan: Plan | null;
};

export const EMPTY_DEMO: DemoValues = { firstName: '', lastName: '', email: '', phone: '', role: '', organisation: '', users: '', website: '', captcha: '' };

export function initialValues(plan: Plan | null): DemoValues {
  return { ...EMPTY_DEMO, users: plan === 'custom' ? MORE_USERS : '' };
}

export function showsOrganisation(role: string): boolean {
  return ORG_ROLES.includes(role);
}

// "Your role" and "Number of users" are the names used in error messages; the visible labels are "I am a" and "How many users".
const FIELDS: Field[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, maxLength: 80 },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, maxLength: 80 },
  { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', label: 'Phone number', type: 'tel', required: true, maxLength: 20 },
  { name: 'role', label: 'Your role', type: 'select', required: true },
  { name: 'users', label: 'Number of users', type: 'select', required: true },
];
const ORG_FIELD: Field = { name: 'organisation', label: 'Centre or school name', type: 'text', required: false, maxLength: 120 };

export function validateDemo(values: DemoValues): Record<string, string> {
  const fields = [...FIELDS, ...(showsOrganisation(values.role) ? [ORG_FIELD] : []),];
  const errors = validateFields(values, fields);
  if (!values.captcha.trim()) errors.captcha = 'Enter the code shown';
  if (!errors.phone && values.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number';
  return errors;
}

export function toRequest(values: DemoValues, dialCode: string, plan: Plan | null): DemoRequest {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: `${dialCode} ${values.phone.trim()}`,
    role: values.role,
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
