# Job detail audit (/careers/[slug]), desktop 1440

Sources: `scratchpad/pdf/job-default` (Account Executive, Apply now), `job-apply-form` (AE, dialog open), `job-submitted` (CSM, success dialog), `job-applied` (CSM, Applied). Copy is taken from the `-1` files where they differ (CSM copy is in `job-applied`, see row 9).

This is a new page: there is no prototype to diff against. The "prototype has" column is the target look taken from the existing site (contact-us hero, ContactForm, Select, Button) that the new page reuses.

| # | section | element | PDF shows | prototype has | action | frozen? |
|---|---|---|---|---|---|---|
| 1 | global | header nav, logo, Sign in, Try demo | nav bar over the page | layout Header (owned by layout) | none (layout) | no |
| 2 | hero | "← Back to careers" link | teal text link with arrow, top left, to careers | none | add | no |
| 3 | hero | job title h1 | "Account Executive" / "Customer Success Manager", ~48px Nunito, teal | none | add | no |
| 4 | hero | header CTA | "Apply now" (lg pill, right) -> "Applied" (grey, disabled) after submit | none | add | no |
| 5 | hero | location line | "Location:" bold + value | none | add | no |
| 6 | hero | background | light teal to cream gradient, 390px tall | `Section hero` (`--gradient-hero`) | reuse | no |
| 7 | body | "Role Overview" h2 + 2 paragraphs | AE copy (Field Sales Representative paragraph) | none | add | no |
| 8 | body | "Key Responsibilities" h2 + 7 bullets (AE) | AE list | none | add | no |
| 9 | body | CSM role overview, responsibilities (8) and qualifications (5) | CSM copy in `job-applied` (correct CSM text) | n/a | add (CSM copy from -1 file) | no |
| 10 | body | "Required Experience & Qualifications" h2 + bullets | AE: 6 items; CSM: 5 items | none | add | no |
| 11 | body | in-body CTA under qualifications | "Apply now" pill (same as header), "Applied" grey after submit | none | add | no |
| 12 | dialog | scrim | full-page grey overlay, header dimmed | none | add (fixed overlay) | no |
| 13 | dialog | "Apply for this job" card | 584px card, 24px radius, light teal-white bg, 32px padding | none | add | no |
| 14 | dialog | First Name*, Last Name* | 2-column row, required | none | add | no |
| 15 | dialog | Email*, Phone number* (+91 prefix) | 2-column row, phone has +91 with chevron | none | add | no |
| 16 | dialog | Reusume/CV* | file box with "Choose a file" + "No file selected." | none | add | no |
| 17 | dialog | "How did you hear about this opportunity?*" | select, placeholder "Please select" | none; **no option list in PDF** | add (options: question) | no |
| 18 | dialog | "Submit application" | full-width teal button | none | add | no |
| 19 | dialog success | "Application submitted!" h2 | teal heading | none | add | no |
| 20 | dialog success | thank-you copy with bold role name | "Thank you for applying for the <b>role</b> role at CognitiveBotics." + review copy | none | add | no |
| 21 | dialog success | "Back to careers" full-width pill | links to careers | none | add | no |
| 22 | footer | footer, ISO badge, socials | footer | layout Footer | none (layout) | no |

Inconsistencies found in the PDFs (reported, not silently resolved):
- `job-submitted` (CSM success state) shows the AE "Role Overview", AE responsibilities and AE qualifications. `job-applied` (CSM, -1 file) shows the CSM copy. Implemented the CSM copy from `job-applied`.
- AE copy says "We are looking for a Field Sales Representative (Account Manager)" under the heading "Account Executive". Kept as in PDF, flagged.
- Typos kept verbatim from the PDF: "Reusume/CV", "K12schools". Flagged.
- Form in `job-submitted` header still shows "Apply now" while the success dialog is open; `job-applied` shows "Applied". Implemented: header flips to "Applied" when the success dialog is dismissed.
