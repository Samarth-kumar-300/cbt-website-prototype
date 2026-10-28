# Contact us (`/contact-us`) notes

## Decisions

- **Captcha**: the original has an "Enter code shown*" field and a displayed code that rotates on every capture. It is rendered as a plain required text input with a STATIC code label (`VKNB62`, the 1440 capture). No real captcha, and the typed value is not compared with the label. The refresh button clears the input and refocuses it (it cannot rotate the static code). Replace with a real challenge (for example Turnstile) when a backend exists.
- **Phone field (intl-tel-input)**: the scaffold contained the captured widget markup (closed selector, hidden dialog with search input, ~244 list items, 197 KB `Section0.tsx`). The widget CSS (`iti__*`, `phone-input-teal`) is not in the project. Replaced by a compact control: the closed state is a "+91 v" label drawn inside the input (same 74px left padding as the original), with a transparent native `<select aria-label="Country code, currently ...">` over it holding 10 common countries (IN, US, GB, AE, SA, QA, SG, AU, CA, DE). It is keyboard and screen-reader accessible and shows a focus ring when focused. The full country list and flag sprites are dropped. The chosen dial code is UI-only (not sent anywhere).
- **Required fields**: `reference/interactions.json` `contactForm.inputs[*].required` is `false` everywhere. Labels ending in `*` are treated as required: Name, Email, Phone number, Professional/Parent (select, `name: topic`), Message, Enter code shown. Country is optional. `FIELDS` is hard-coded in `ContactForm.tsx` (not imported from the reference JSON, to keep that file out of the client bundle). Select options come from `contactSelect`: Therapist, Parent, Therapy Centre Admin, Psychiatrist, Other. Textarea `maxLength` is 2000 as specified.
- **Submit**: stub only (600 ms delay, then a `role="status"` confirmation and the form clears). No network call; `tests/e2e/contact-us.spec.ts` asserts no non-GET request is made. Wire up a real endpoint later.
- **Select keyboard behavior**: opening the list with no selected value highlights nothing; the first ArrowDown highlights the first option. The brief's unit test (Enter, ArrowDown x2, Enter -> second option) requires this. Because of it, I changed the e2e keyboard test's final assertion from `/options[1]/` to `: options[0]$`, since the briefed regex `/Parent/` also matched the field label "Professional/Parent" and would have passed vacuously.
- Field labels are real `<label for>` elements (the scaffold wrapped the whole field in a `<label>`) so error `<p role="alert">` messages are not part of the input's accessible name. Visual classes are unchanged.

## Deviations from the scaffold (all Section0 hero)

- Placeholder `ratio` 0.984 -> 1.131. `reference/contact-us/*.json` `imgRects` show the original image is always w/h = 1.131 (260x230 on mobile, 520x460 at 1440). The 0.984 value (from the intrinsic 420x427) made the stand-in too tall at 375/768 (verify mismatch 10%/20%). Desktop was unaffected because the form column sets the height.
- Placeholder className gained `max-w-[260px]` (kept `w-[260px] lg:w-full lg:max-w-[520px]`). `Placeholder` applies `w-full` whenever `ratio` is set, which beat `w-[260px]` on mobile and stretched the stand-in to full width.
- The hero's `<form>` moved to `ContactForm.tsx`; Section0.tsx now only holds the hero text/image and renders `<ContactForm />`.

## Requests for the lead (read-only files)

- `components/shared/Placeholder.tsx`: `ratio` forces `w-full` ahead of caller width classes (see above). Consider letting `className` width override it. Image `Cobo_Flying_f9e92a3b0a.png` has no local file (`local: null`), so the page still shows the "Image" stand-in.
- Footer (shared) differs from the reference: ISO 27001 badge is a text placeholder, social icons are text circles, link text size/weight differ, so total page height differs (375: 2877 vs 2660, 768: 2336 vs 2283, 1024: 1949 vs 2138, 1440: 1840 vs 1913). Remaining 375px bad band (2000-2200) is the footer.
- Header at the capture is positioned slightly differently in the 1440 reference (logo/nav offsets of ~10-15px) -- shared component, not touched.
