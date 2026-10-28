export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
};

export const JOBS: readonly Job[] = [
  {
    slug: "account-executive",
    title: "Account Executive",
    department: "Sales",
    location: "Lucknow / Chandigarh",
    type: "Full-time",
  },
  {
    slug: "customer-success-manager",
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Hyderabad, India",
    type: "Full-time",
  },
];

export const DEPARTMENTS = ["Sales", "Customer Success"] as const;
export const LOCATIONS = ["Lucknow / Chandigarh", "Hyderabad, India"] as const;
