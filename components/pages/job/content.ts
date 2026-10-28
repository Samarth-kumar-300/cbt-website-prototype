export type Job = {
  slug: string;
  title: string;
  location: string;
  overview: readonly string[];
  responsibilities: readonly string[];
  qualifications: readonly string[];
};

export const JOBS: readonly Job[] = [
  {
    slug: "account-executive",
    title: "Account Executive",
    location: "On-site - Lucknow / Chandigarh",
    overview: [
      "We are looking for a Field Sales Representative (Account Manager) to drive institutional and government sales for CognitiveBotics while building and maintaining long-term customer relationships.",
      "The role will work across therapy centres, schools, CSR partners and government agencies, combining new business development with account farming to expand adoption and strengthen CognitiveBotics' presence across B2B2C and B2G2C channels.",
    ],
    responsibilities: [
      "Manage full sales cycle for assigned accounts (therapy centres, K12schools, special schools, CSR, NGO and Govt)",
      "Develop partnerships with RCI-accredited centres, DEICs and CSR divisions",
      "Conduct demos, presentations, and product workshops for schools & therapy stakeholders",
      "Negotiate contracts, MoUs and renewals",
      "Coordinate with the CSM for onboarding & retention support",
      "Track account performance and identify upsell / cross-sell opportunities",
      "Represent CognitiveBotics in conferences, workshops and exhibitions",
    ],
    qualifications: [
      "5–7 years in institutional / Concept / B2B sales, preferably in education or healthcare",
      "Strong network within the therapists network, education or CSR ecosystem",
      "Proven record in closing deals with schools, NGOs or govt agencies",
      "High EQ and consultative sales approach - selling value, not just price",
      "Willingness to travel (up to 50–60% of time)",
      "Location – Lucknow/Chandigarh",
    ],
  },
  {
    slug: "customer-success-manager",
    title: "Customer Success Manager",
    location: "On-site - Hyderabad, India",
    overview: [
      "We are looking for a Customer Success Manager to act as the bridge between sales, product, and retention, ensuring CognitiveBotics customers, including therapists, centres, schools, and parents, derive maximum value from the platform.",
      "The role will oversee onboarding, adoption, satisfaction, renewal, and advocacy, while bringing customer insights back into the organization to help shape product evolution and strengthen the overall customer experience.",
    ],
    responsibilities: [
      "Own post-sales relationship with therapists, centres, and institutional clients (schools, CSR, DEICs)",
      "Lead onboarding & training for therapists and parents; ensure smooth product adoption",
      "Track usage analytics, measure impact, and proactively address churn risks",
      "Collaborate with Product & Tech teams to relay feedback and suggest feature enhancements",
      "Drive renewals, upsells, and referrals, maintaining a strong LTV/CAC ratio",
      "Build therapist “ambassador” programs for micro-distribution",
      "Support in drafting case studies and success stories for marketing & CSR visibility",
      "Conduct periodic customer health reviews with dashboards (usage, satisfaction, feedback)",
    ],
    qualifications: [
      "8 years in Customer Success / Account Management in SaaS, EdTech, or HealthTech",
      "Excellent stakeholder management across B2B (centres/schools) and B2C (parents)",
      "Understanding of early intervention, therapy, or special education ecosystem preferred",
      "Strong analytical mindset, with the ability to read data and act on insights",
      "Empathetic communicator, able to handle emotionally sensitive parent interactions",
    ],
  },
];

export function getJob(slug: string): Job | undefined {
  return JOBS.find((j) => j.slug === slug);
}

/* Options for "How did you hear about this opportunity?". The PDF shows the field but no option list. Placeholder until confirmed. */
export const HEARD_ABOUT_OPTIONS = [
  "LinkedIn",
  "Job board",
  "Referral",
  "Other",
] as const;
