# Careers page notes

## Status
- Route /careers built from PDF "Careers — open positions.pdf". Type-check and lint clean for owned files. No browser render or e2e run.

## Open items
- Hero illustration (three children holding hands): not among the PDF's embedded images and not in public/images. Placeholder used. Needs the asset from design.
- Resume form: Submit has no endpoint in the repo, so it does nothing on submit. Needs a destination (HR inbox, form service or API).
- Job detail routes /careers/account-executive and /careers/customer-success-manager are built by another agent.

## Jobs listed
- account-executive: Account Executive, Sales, Lucknow / Chandigarh, Full-time
- customer-success-manager: Customer Success Manager, Customer Success, Hyderabad, India, Full-time

## Shared changes requested
- Round 2 image pass: components/shared/Footer.tsx IsoBadge should render public/images/careers/careers-iso-27001-badge.webp (268x343, same ratio as the 67x86 PDF badge) instead of its Placeholder. Unlinked, alt "ISO 27001 certified", 67x86. Owner: shared footer.
