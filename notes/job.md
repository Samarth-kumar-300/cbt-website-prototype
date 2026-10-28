# Job detail notes (/careers/[slug])

### "How did you hear about this opportunity?" has no option list
- Type: unmatched-section
- Where: components/pages/job/content.ts (HEARD_ABOUT_OPTIONS)
- Detail: the PDF shows the required select with placeholder "Please select" but no options. Placeholder options (LinkedIn, Job board, Referral, Other) are in place so the form can be submitted. Replace with the real list.

### Header button flips to "Applied" only after the success dialog is dismissed
- Type: deviation
- Where: components/pages/job/JobPage.tsx (phase machine)
- Detail: the brief lists "submit -> success message -> header Applied". The PDF `job-submitted` shows the header still as "Apply now" behind the success dialog, and `job-applied` shows "Applied". Implemented: success dialog keeps the header at "Apply now"; dismissing it (Back to careers, Escape or scrim click) sets Applied.

### Applied state is not persisted
- Type: deviation (question)
- Where: components/pages/job/JobPage.tsx
- Detail: no backend and no storage, so a reload returns to "Apply now". Decide whether Applied should persist per browser (localStorage) or per account.

### Role copy inconsistency between PDFs
- Type: deviation
- Where: scratchpad pdf `job-submitted` (CSM) vs `job-applied` (CSM, -1 file)
- Detail: the CSM success state shows the Account Executive Role Overview, responsibilities and qualifications. The CSM Applied state shows CSM copy. Implemented the CSM copy from `job-applied`. Confirm with design.

### Account Executive title and copy do not match
- Type: question
- Where: components/pages/job/content.ts (account-executive)
- Detail: the heading is "Account Executive" but the Role Overview says "We are looking for a Field Sales Representative (Account Manager)". Copied as-is.

### Typos kept from the PDF
- Type: question
- Where: components/pages/job/ApplyDialog.tsx (label "Reusume/CV"), content.ts ("K12schools", "Concept / B2B sales")
- Detail: the PDF says "Reusume/CV". It is probably "Resume/CV". Kept verbatim until confirmed. Same for "K12schools" and "Concept". Also the error message for the file uses the same label.

### Phone country code
- Type: question
- Where: components/pages/job/ApplyDialog.tsx (phone field)
- Detail: the PDF shows "+91" with a chevron. No country list is given, so "+91" is static text and the chevron is decorative. Confirm whether the code should be selectable (the contact form has a dial-code list).

### Dismissing the dialog
- Type: question
- Where: components/pages/job/ApplyDialog.tsx
- Detail: the PDF shows no close control. Escape and clicking the scrim close the dialog. Confirm whether an X button is wanted.

### Resume accept types
- Type: question
- Where: components/pages/job/ApplyDialog.tsx (`accept=".pdf,.doc,.docx"`)
- Detail: the PDF does not name allowed file types. This is an assumption.

### Shared Button cannot open the form
- Type: shared-change-request
- Where: components/shared/Button.tsx
- Detail: Button only renders a link. The Apply now and Applied CTAs are native buttons (components/pages/job/ApplyButton.tsx) with the same lg classes. A `button` mode (onClick, disabled) on the shared Button would remove the duplicate class string.

### Metadata description is invented
- Type: deviation
- Where: app/careers/[slug]/page.tsx (generateMetadata)
- Detail: the PDF has no page title or description. Title is "<role> | CognitiveBotics"; description is "<role> role at CognitiveBotics.".

### Not verified
- No browser render, no `next build` (shared tree rule). `npx tsc --noEmit` and `npx eslint` on the new files are clean. Copy was checked by script against the PDF text.
