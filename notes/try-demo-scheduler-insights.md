# Try-demo scheduler: insights and verdict

Date: 2026-11-13. Audience: Samarth. Inputs: `notes/try-demo-scheduler-research.md` (99 screens, 8 flows, 78 products), the current picker code, and the CBT grammar guide. No code, spec or plan was changed.

How to read the references. "Web #16" means row 16 in section 3a of the research file, "iOS #11" means row 11 in section 3b, "Flow #3" means row 3 in section 3c, and "§4G" means pattern family G in section 4. Everything in the research was read from Mobbin preview images, so it shows what products DO. It does not show what converts. That limit applies to every insight below, and I repeat it only where it changes the call.

---

## 1. Intent, constraints, success criteria

- Intent: decide how the Try Demo step should capture a date and a time, and test the team's idea (a date input and a time input, each with quick-pick chips below) against the evidence.
- Constraint, from the code: `PrototypeCalendar` is a placeholder. `CALENDLY_URL` in `lib/demo-config.ts` is an empty string, and the file's own comment says to delete it once the link is set. When the link is set, `DemoSchedule` calls Calendly's popup widget and Calendly's own month-plus-times UI replaces everything we draw. Whatever we build for the picker is probably throwaway. That changes how much to invest (see the scope note at the start of section 7).
- Constraint, stack: Next.js, Tailwind, existing pill chips, no backend, no availability data, times in India Standard Time, modal capped at 480px and bottom-aligned on phones, and all copy follows `guidelines/CBT-guidelines.md`.
- Success criteria (assumptions): (1) the visitor can say out loud what day, time and time zone they booked; (2) the prototype looks like the shape of the Calendly flow that will replace it, so the team does not sign off a UI that will not ship; (3) nothing built has to be deleted twice; (4) after launch, the number to watch is `demo_booked` divided by `demo_submitted`. Both events already exist in `DemoFlow.tsx`.
- Assumption A1: most visitors are in India, so one time zone is enough. Assumption A2: the demo is about 30 minutes. Assumption A3: a large share of visitors book from a phone. I have no analytics to confirm any of these. They are in section 8.
- Assumption A4: the team's idea is meant for the placeholder, not for a custom picker that would live next to Calendly.

---

## 2. Diagnosis of the current picker

Start with what works, because you should not break it. The chips use `aria-pressed` inside a `fieldset` with a `legend`, so the grouping is correct for assistive tech. Focus moves to the heading on open, Escape closes, and the sheet sits at the bottom on phones, which matches the iOS sheet convention in the evidence (§4I, 14 products). The time chips ("10:00 am") already follow guide rule 3.5. Five times per day is inside the normal range (Pin shows 3, Klook 5, Care.com 7).

Now the feeling that something is off. It is a menu pretending to be a timetable. The code builds 25 combinations: the `SLOTS` constant (5 fixed times) multiplied by `nextWeekdays(today, DAYS)` with `DAYS = 5`. Every day has exactly the same times, nothing is ever taken, and both rows are live from the first second. A real calendar has texture: days with fewer times, gaps, a full day (Fresha has a gap from 11:45 to 12:45 in iOS #2, Zoom has a "No availability" column in Web #29). A grid of ten identical pills has none, so the visitor reads it as "these are not real". That is a correct reading, because they are not.

Ranked by severity:

| Rank | Problem | Where it shows in the code | Root cause |
|---|---|---|---|
| 1 | Date and time are two independent menus of invented options, not one choice among real slots | `SLOTS` x `DAYS`; `disabled={!day \|\| !slot}` lets you pick in any order; same 5 times on every day | The UI models two fields. The thing the business actually has is a set of slots (a day plus a time). This is the single biggest problem. |
| 2 | The pick disappears | `onConfirm: () => void` ignores `day` and `slot`; `DemoSchedule` just calls `onBooked()`; `DemoDone` shows no date, time or zone and redirects after `REDIRECT_SECONDS = 3` | Nobody wired the selection to anything, because it was only a stand-in. The visitor cannot check what they booked. |
| 3 | A dead-end horizon | `DAYS = 5` hardcoded; no arrows, no calendar; today is excluded (`nextWeekdays` adds a day before it pushes, and a unit test asserts "never includes today"); weekends vanish with no hint, so Friday is followed by Monday | A window was chosen for convenience and never explained. The visitor cannot tell if "next week" exists. |
| 4 | Time zone and length are missing or buried | "Times are in IST." in 14px secondary text above the chips; nothing says how long the demo is (`content.ts` has no length anywhere) | Treated as footnotes. They are two of the first things a visitor checks. |
| 5 | Confirm is disabled with no reason | `disabled:opacity-50` and no hint text | Disabled was used as the only feedback. |
| 6 | Copy | "Sample times for the prototype" is shown to visitors; "Pick a time" is the title for a date and a time; "Wed, 18 Nov"; bare "IST" | See section 9. |
| 7 | Small stuff | Chips are `min-h-[40px]` while the buttons below are 44px; chip rows will wrap raggedly at 375px (my estimate, not measured) | Chip style was reused without a tap-size check. |

Single biggest problem: rank 1. The weirdness is not a styling problem. If you keep two independent menus and only change what the menus look like, the weirdness stays. Hold that thought for the verdict.

---

## 3. Insights from the evidence

Counts are products, not screens, unless I say otherwise.

### 1. Where a visitor takes a slot from someone else's calendar, the usual pattern is a month grid plus a list of times for the chosen day.
- Evidence: 13 scheduling tools: Hotjar (Web #5), Pin (#6), Upwork (#9, #10), Braintrust (#14), Calendly (#16, #17), Lyssna (#19), Bonsai (#20), Kajabi (#25), Cal.com (#26 to #28), Maze (#32), HubSpot (#43), Apollo (#44, Flow #1), Wrangle (#50). Three more show 3 to 5 day columns beside a mini month: Clockwise (#21), Zoom (#29), Motion (#30). §4A lists 32 products in this family overall.
- Why it matters: the visitor has done this on other sites. They do not need to learn it.
- So what for CBT: this is what Calendly will show (Web #16, #17), so the placeholder should rehearse "pick a day, then see that day's times".
- Counter-evidence: consumer service booking leans on a date strip, 20 products (§4B: Fresha, Preply, Headspace, Amie, Airbnb spa and others).
- Confidence: high that it is the common pattern (many products, and it includes the exact tool CBT will ship). The file says nothing about conversion.

### 2. Times belong to a day. Good pickers reveal times only after a day is chosen, and different days differ.
- Evidence: Calendly's first state shows only the calendar until a date is picked (Web #17); Apollo is the same two-step (Web #44). Days differ in Walmart pharmacy (Sunday starts at 10:20 am, Web #11), Zoom (Sunday reads "No availability", Web #29 and Flow #6), Fresha iOS (gap from 11:45 am to 12:45 pm, iOS #2), Cal.com (a day with only 2 slots, Web #28), Warby Parker (irregular times, iOS #5), Octopus Energy (iOS #9). That is 8 products.
- Why it matters: a visitor who can tap a time before a day is chosen has no reason to think the two interact. Identical times every day also say "no real calendar behind this".
- So what for CBT: make the time list depend on the picked day, and let days differ, even if the sample data is made up.
- Counter-evidence: Mailchimp (Web #45), Dribbble (#24), Crate & Barrel (iOS #1), Rivian (iOS #7) and Google Maps (iOS #17) show date and time as separate controls. In the three that depend on availability (Crate & Barrel, Rivian, Google Maps) the availability shows elsewhere: struck-through dates, or greyed taken chips.
- Confidence: high that the pattern exists, medium that it changes completion.

### 3. Dates shown at once: strips show 3 to 7, months show about 30, and every strip in the evidence can go further.
- Evidence: 7 dates in Fresha (Web #3), Walmart auto care (#12), Preply (#13), Amie (#15), Airbnb spa (#36), Navan (#47), Careem (iOS #8); 3 to 6 in Zillow, Zomato, Woolworths, Headspace, Redfin, Swiggy, Alan (§4B). Ways to go further: arrows (Fresha web, Preply, Amie, Headspace, Navan, Zillow, Angi), cut-off edge cards (Fresha iOS, Warby Parker, Future Pro, Zomato, Redfin, Woolworths), a "Next week" link (Walmart, Web #12), a calendar icon (Fresha #3, Airbnb #36), a "Select date" button (Amie #15). A stated window appears in IKEA ("May 4th - May 31st", Flow #8), Places ("7-day window", iOS #25) and the Zillow host note ("up to three weeks", Web #53).
- Why it matters: the visitor's question is "is there anything sooner or later?", not "how many days are shown?".
- So what for CBT: 5 is a fine number. The problem is that ours cannot move and does not say how far ahead demos go. Add paging, state the window, and give a way to reach a farther date. That last part is where the team's "date input" instinct belongs.
- Counter-evidence: Care.com (Web #7), Rivian (iOS #7) and Hotjar (Web #5) show only 1 to 7 active dates in a month. A short window is normal when it is true.
- Confidence: high on the counts, medium on the conclusion.

### 4. Times shown at once vary from 2 to 22. The step is usually 15 or 30 minutes. Most tools show the length of the meeting beside the picker.
- Evidence: Navan shows 1 slot (Web #47), User Interviews and Cal.com's few-slots day show 2 (#34, #28), Hotjar and Motion show 8 in a scrolling list (#5, #30), GoDaddy 12 chips (#37), Airbnb spa 22 chips with no scroll (#36). Partial lists with "show more": Clockwise (#21), Booking.com (iOS #6), Swiggy (iOS #23). Steps from §4: 15 minutes in 13 products, 30 minutes in 11. Irregular spacing shows up only where it reflects a real constraint: Cal.com's 75-minute spacing equals its 1h 15m duration (#26), Warby Parker (iOS #5), Clockwise's curated list (#21). Length shown near the picker: Calendly "30 min" (#16), Upwork "Duration 30 Minutes" (#9), Lyssna "Duration 45 minutes" (#19), Bonsai (#20), Kajabi (#25), Maze (#32), Apollo "60 minute meeting" (#44), Motion (#30), Zoom (#29), Wrangle (#50), Navan (#47), Selfridges (#1) and more. At least 15 web products.
- Why it matters: length and step tell the visitor what they are signing up for and whether the slot fits their day.
- So what for CBT: our 5 chips (10:00 am, 11:30 am, 2:00 pm, 3:30 pm, 5:00 pm) are 90, 150, 90 and 90 minutes apart, which means nothing. Our picker also never says how long the demo is. Show the length next to the title, and take the step from the length (a human decision, section 8).
- Counter-evidence: Clockwise shows a short curated list with a "BEST" badge (#21), which argues for fewer slots, not more. The file cannot say which count books best.
- Confidence: high that length is commonly shown, low to medium on the "right" number of times.

### 5. Typed date and time fields are mostly a host or admin pattern, and they disagree about day and month order.
- Evidence: 12 products use typed or field-style entry (§4D, §5). Four are visitor-side: Mailchimp (Web #45, #46, Flow #3), Dribbble (#24), LinkedIn (iOS #33), Todoist (iOS #35). Eight are host or own-schedule: Zoom form (#52), Teams (#39), Riverside (#40, #41), Time2book (#38), Zoho CRM (Flow #5), Zillow listing (#53), Linktree (iOS #42), ClickUp (iOS #36). Against that, 13 tools use a grid for visitor booking (insight 1). Order of day and month, where the number proves it: dd/mm in Time2book "27/11/2025" (#38), Zoho "19/03/2026" (Flow #5), Amie iOS "13/02/24" (iOS #32); mm/dd in Teams "5/30/2025" (#39), Mailchimp "07/30/2024" (#45), Zoom form "12/23/2024" (#52). Three against three. Dates written with a month name avoid the problem: Dribbble "11 May 2026" (#24), Zillow listing "Saturday, May 30" (#53). Zoho's blocking popup reads "Please provide a valid outgoing call status and call start time" (Flow #5), which is generic. Mailchimp's time list starts at 12:00 am and the example shows 1:00 am chosen and confirmed (#46, Flow #3). Time2book restates what was typed as a sentence under the fields (#38).
- Why it matters: this is the "02/03/2026" problem from guide rule 3.4. A typed field lets a visitor enter a day nobody offers, at a time nobody works.
- So what for CBT: typed entry is not how the tools that book a slot do it. If you want a date field, it should open a calendar, not accept free typing.
- Counter-evidence: Mailchimp's onboarding-call modal is the closest match to the team's idea in the whole file: a date input plus a time select, no chips (Web #45). Whether it enforces availability is not visible. Several typed fields also open a popover or wheel (Teams, LinkedIn), so "typed" is often "typed or picked".
- Confidence: high that typed entry is mostly host or own-schedule (the file says so and the rows agree). Medium to low that it "causes errors": these are static screenshots, and the mm/dd versus dd/mm split probably reflects locale, which the file cannot show.

### 6. Shortcuts split by problem type. Where a system knows availability, the shortcut jumps to a real slot. Where you choose your own time, shortcuts are relative dates.
- Evidence, availability-bound (6 products): Mailchimp "Next available: Friday 12 July 2024 at 7:00 pm GMT+7" with "Find a different time" (Flow #3), Clockwise "Show soonest" and a "BEST" badge (Web #21), Fresha "Go to next available date" (Web #4), Fresha iOS Today and Tomorrow cards (iOS #3), Zocdoc starting the list at the first day with times (iOS #14), Zillow "as early as today at 11:00 am" (Web #23). Own-schedule (4 products): Todoist (Today, Tomorrow, This Weekend, Next Week, iOS #35), ClickUp (iOS #36), Quo "Tomorrow morning" (iOS #39), Outlook relative days (iOS #37).
- Why it matters: a "Tomorrow" chip is safe in a task app because any day is valid. In a booking it is a promise that tomorrow has a slot.
- So what for CBT: "quick-pick chips under date and time inputs" is the own-schedule pattern, applied to a job that is availability-bound. If you want a shortcut, make it a "Next available" suggestion computed from real slots, with a way out.
- Counter-evidence: Fresha iOS puts quick date cards above a month calendar (iOS #3), so quick date cards do exist in availability-bound products. That sheet also greys unavailable dates.
- Confidence: medium. The split into two groups is my reading of the rows. The research file does not state it.

### 7. Grouping times by part of the day is a minority pattern, and the tools that Calendly belongs to do not use it.
- Evidence: 11 products group (§4J): Selfridges, Preply, HoneyBook, GoDaddy, Woolworths, CVS Health, Alan, Zomato, Swiggy, Deliveroo, Fresha iOS. Of the 13 grid-style scheduling tools in insight 1, only HoneyBook (Web #8) and GoDaddy (#37, admin side) group. Calendly shows a flat list (#16).
- Why it matters: grouping helps scanning when the list is long (Preply, GoDaddy, Alan).
- So what for CBT: skip it. Five slots between 10:00 am and 5:00 pm do not need headings. If the list ever passes about 8 slots, add AM and PM like HoneyBook. Put the effort elsewhere.
- Counter-evidence: CVS Health groups only 3 slots under "Morning" (iOS #11), so length is not the only trigger. If parents mostly want evenings, a part-of-day filter could matter (Fresha iOS chips "Anytime, Morning, Afternoon", iOS #3). We do not know that.
- Confidence: medium to high.

### 8. Time zone: scheduling tools show it next to the times, with a change control, and repeat it on confirmation.
- Evidence: 14 visitor-facing scheduling tools have a changeable zone (Upwork, Calendly, Cal.com, Zoom, Lyssna, Bonsai, Kajabi, Maze, Apollo, Wrangle, HoneyBook, Clockwise, SavvyCal, HubSpot, §4G), plus 6 own-schedule or host apps. Six show text only: Preply, Headspace, Dribbble, Motion, IKEA, Mailchimp. Three show the local time beside the zone, so the visitor can sanity-check: Hotjar "Asia/Kuala Lumpur (20:05)" (Web #5), Navan (#47), Calendly "Indochina Time (11:40)" (#16). Zone repeated on the confirmation: Apollo (Flow #1), Navan (Flow #2), Mailchimp (Flow #3), Zoom (Flow #6), IKEA (Flow #8). Zone suffix on each slot: Kajabi (#25), User Interviews (#34).
- Why it matters: a wrong zone is a no-show, and nobody notices until the call time passes.
- So what for CBT: ours is a bare "IST" in 14px grey text at the top, before the chips and not repeated. Put the zone, spelled out, next to the times and in the summary and the done screen. A change control only makes sense if non-India visitors matter (a human call, section 8). Calendly brings its own control, so do not build one.
- Counter-evidence: six consumer products show text only, and for an India-only audience a fixed label may be enough. The file does not say whether any of these zones were auto-detected (§5), so I cannot say what is safe to promise.
- Confidence: medium. The display is common. The effect is not in the evidence.

### 9. Unavailable and empty states are everywhere, and the best ones give an exit.
- Evidence: about 15 products mark unavailable days or times (§4H): struck-through or greyed (Fresha, Crate & Barrel, Places, Booking.com, Rivian), labelled ("Full" in Walmart Web #12, "Fully Booked" in Octopus iOS #9, "No availability" in Zoom Web #29, "No available appointments" in Zocdoc iOS #14, "Sold out" in Klook Web #2). With exits: Fresha's fully booked day offers three ways forward (Web #4), Zocdoc offers "Notify me" (iOS #15), Apple shows the next day's items automatically (Web #48) or two ways forward (#49).
- Why it matters: an empty day with no exit is a dead end, and a visitor leaves.
- So what for CBT: our placeholder never has an unavailable state, so it never rehearses one. Make one sample day fully booked with copy that offers the next day. When Calendly is live, our only unavailable-style copy is `schedule.error` (the calendar did not load).
- Counter-evidence: some products simply leave days out (Motion skips Sunday, Web #30; Maze's list omits weekends, #33). That works when the window is stated. Wrangle (#50) shows an all-grey month with one boxed date, and the file cannot say whether it is loading or empty. Treat it as a warning.
- Confidence: high that it is common, medium on its value.

### 10. Container: phones get a bottom sheet with the month stacked above the times. Desktop puts month and times side by side.
- Evidence: iOS bottom sheets in 14 products and full screens in 8 (§4I). Desktop modals in 10 and inline cards in 11. Month above times: Booking.com (iOS #6), Crate & Barrel (#1), Rivian (#7), Deliveroo (#21). Month beside times: Klook (Web #2), Calendly (#16), Kajabi (#25). Confirm sits in a full-width sticky footer on iOS (Fresha, Careem, Redfin, Rivian) and bottom right in desktop modals (Upwork, Care.com, Lyssna, Airbnb).
- Why it matters: our modal is capped at 480px, which cannot hold Calendly's side-by-side layout.
- So what for CBT: keep the bottom sheet on phones and stack. If a month grid is ever used on desktop, widen the modal.
- Counter-evidence: these are mostly iOS app screens. The research file has no mobile-web view (§5), so I cannot show how any web scheduler collapses at 375px, including Calendly.
- Confidence: medium. Test the real Calendly popup on a phone the day the link exists.

### 11. Primary action: most products grey it out until ready, a few reveal it only after the pick, and two repeat the pick in the label.
- Evidence: greyed or disabled until a time is chosen in at least 9 products: Upwork (Web #9, #10), Preply (#13), Maze (#33), Booking.com (iOS #6), Google Maps (iOS #17), Zomato (#18), Swiggy (#23), Angi (#46), Fresha waitlist (iOS #4). Revealed beside the selected time in 3: Calendly "Next" (Web #16), Hotjar "Confirm" (#5), Apollo "Confirm" (Flow #1). Label repeats the pick in 2: CVS Health "Book 9:10 AM" (iOS #11), Future Pro "Book Thu, Jul 2 at 12:00..." (iOS #10). Reasons given for a disabled state: HoneyBook's banner "Please select an available date and time." (Web #8), Crate & Barrel's numbered "(required)" labels (iOS #1). Labels vary: Confirm, Next, Continue, Book, Schedule appointment, Book interview. The label that names the object (Maze "Book interview") is clearer than a bare verb.
- Why it matters: a greyed button with no reason looks broken.
- So what for CBT: add a reason, or reveal the button only after the pick. Name the action and the object ("Confirm demo time"). Do not use "Next": nothing comes after it in our flow, because the form came first.
- Counter-evidence: greyed-until-ready is the most common choice, so it is not wrong. It only needs a reason. The two products with a form-first flow similar to ours (incident.io "Book a time" Web #51, Sana "Select a time" Flow #4) have their scheduler step missing from the file, so I have no evidence for the handoff from form to scheduler.
- Confidence: medium.

### 12. After the pick, the good products restate the choice before and after commit, and offer a way to change it.
- Evidence, before commit (about 10 products): Selfridges summary card with Edit (Web #1), Fresha summary (#3), Maze "Selected time" card (#32), Amie "WHEN" card (#15), Time2book live sentence (#38), Motion modal subtitle (#31), CVS and Future Pro button labels, Partiful header chips (iOS #31), Lyft live lines (iOS #29). After commit or at the final summary (6): Apollo (Flow #1), Navan (#2), Mailchimp (#3), Zoom (#6), IKEA (#8) show date, time and zone; Alan (#7) shows date and time on a pre-payment summary, with no zone. Change controls: Reschedule (Apollo, Zoom), "Choose a different date or time" and "Cancel appointment" (Mailchimp). Email note: Navan, Apollo, IKEA.
- Why it matters: it is the only moment the visitor checks that they got it right.
- So what for CBT: our picker restates nothing (`onConfirm` throws the pick away) and `DemoDone` has no date, time or zone and redirects after 3 seconds. With the live link it gets worse: `DemoSchedule` calls `closePopupWidget()` the moment Calendly reports a booking, so the visitor never sees Calendly's confirmation either. Our done screen is then the only one, and it says nothing about when the demo is.
- Counter-evidence: Navan, Apollo and IKEA lean on the email for details, so a short confirmation is acceptable if the email arrives. We have no backend of our own, so that depends on Calendly.
- Confidence: high on the pattern, medium on the effect.

---

## 4. Verdict on the team's idea

The idea: a date input and a time input, with quick-pick chips below each.

Direct answer: it is half right. The instinct to add shortcuts is good. The model, two independent inputs, is wrong for this job, and I would not build it as described.

What the evidence supports
- Shortcuts reduce effort, but only in a specific form: Today and Tomorrow quick cards (Fresha iOS #3), "Next available" with "Find a different time" (Mailchimp Flow #3), "Show soonest" (Clockwise #21).
- A way to reach a precise far date is common: a calendar icon or "Select date" button beside a strip (Fresha #3, Airbnb #36, Amie #15).
- Restating what was picked as a sentence under the fields (Time2book #38).
- Mailchimp ships a date input plus a time select in a modal (Web #45), so it is not an absurd pattern.

What it contradicts
- Visitor-side booking uses a grid in 13 scheduling tools, and the tool CBT will ship (Calendly) is one of them. Typed entry is 8 host or own-schedule products out of 12 (insight 5).
- Chips under inputs is the own-schedule shortcut style (Todoist, ClickUp, Quo). Booking shortcuts jump to a slot that exists (insight 6). Our chips would be made up.
- Two inputs repeat the root problem from section 2: date and time stay independent, and nothing tells the visitor what exists.

Risks
- Mobile native pickers: a date field and a time field open the OS wheel or dialog. The evidence shows wheels are an iOS-only pattern for choosing or searching a time (§4E, 11 products), and wheels allow any minute (Canva has 1-minute steps, iOS #41), so someone can book 3:09 pm. The research has no mobile-web view, so I cannot show a better alternative from evidence.
- Accessibility: outside the evidence, native inputs have a decent keyboard baseline and custom typed masks usually do not. The sharper risk is two controls for one value. If the chips and the field disagree after an edit, a screen-reader user hears two answers.
- Free-typing errors: day and month order (3 products one way, 3 the other), times at midnight (Mailchimp's list), weekends, past dates. Each needs a specific error message per guide rule 7, and Zoho's generic popup (Flow #5) is the cautionary example.
- Picking an unavailable slot: with no availability data, any typed value is accepted. The visitor sees "Demo booked" for a Saturday at 10:15 pm. When Calendly goes live the input has nothing to talk to.
- Height: date input, chips, time input, chips is four blocks before the button. On a 375 by 667 phone that probably scrolls inside the sheet (my estimate, not measured).
- Cost: it is the cheapest to build if you use native inputs (low effort), but the cost moves into validation, copy and tests.

A better variant
Keep the two good instincts and change the model: a date strip you can page, with a "Pick another date" calendar for far dates; a time list that depends on the chosen day; an optional "Next available" suggestion as the first quick pick; one sentence that restates the choice. That is Direction 1 in section 7.

Tell the team kindly: the idea comes from a good place. The mistake is common. It copies the look of a form (date field, time field) onto a job that is really "take one of these slots".

---

## 5. Design principles

1. Pick one slot, not two fields. The unit the visitor chooses is a day plus a time, and the UI should show it that way.
2. Show only what exists, and say what lies beyond it: the window, how to page, how to reach a farther date.
3. Put the time zone and the demo length next to the times, in plain words.
4. Restate the choice before and after commit, and let the button name the action and the object.
5. Give every dead end an exit. A full day offers the next available one.
6. If the main button is disabled, say why. Or show it only after the pick.
7. Build the placeholder to be deleted. Make it rehearse Calendly's shape and spend design time on what stays: the step before it, the failure state and the done screen.

---

## 6. Right direction vs wrong direction

> Right direction: change the model (day, then that day's times, then a summary).
> Wrong direction: "input-mode swap". Replacing chips with typed inputs while keeping two independent fields. It looks like a redesign and feels the same. Consequence: you keep the 25-equal-options weirdness and add format errors and out-of-hours entries.

> Right direction: make the sample data honest. Different times per day, one sample-full day, and a visible "Sample times" note while it is a prototype.
> Wrong direction: "Potemkin availability". Identical slots every day dressed as a real calendar. Consequence: stakeholders approve a booking experience that Calendly will not reproduce, and the first real visitor sees something different from what the team signed off.

> Right direction: spend the design time on the frame that survives Calendly (the card before, the failure state, the done screen).
> Wrong direction: "gold-plating the placeholder". Building a custom month grid with keyboard navigation for a file whose own comment says to delete it. Consequence: days of date math and arrow-key handling get deleted, and the team now wants to keep it, which needs an availability backend that does not exist.

> Right direction: state the window ("Demos are available over the next 2 weeks", once someone confirms the number) and give a way to move.
> Wrong direction: "silent horizon". A hardcoded `DAYS = 5` that never says it is a window. Consequence: the visitor assumes there is nothing later, or support hears "why can I not book next month".

> Right direction: if you use inputs at all, use a calendar popover that only offers valid dates and a time list limited to offered times.
> Wrong direction: "native-picker trust fall". Dropping in `type="date"` and `type="time"` and trusting the browser. Consequence (outside the evidence for the browser part): each device shows a different control, format follows the device locale, which is the mm/dd versus dd/mm split seen in the evidence, and the time control allows every minute of the day.

> Right direction: show the reason when Confirm is disabled ("Choose a date and time to book your demo.") or show the button only after the pick.
> Wrong direction: "mystery disabled button". A greyed button with no hint. Consequence: visitors tap it repeatedly and assume it is broken. Outside the evidence, a native disabled button also drops out of keyboard focus, so keyboard users cannot find out why.

> Right direction: use the evidence to remove bad options, then watch one real person.
> Wrong direction: "N products do it, so it converts". Treating a count of Mobbin screens as proof. Consequence: you cannot answer "how do you know?" in a review. Nothing in the file measures bookings.

> Right direction: write our own copy to the CBT guide.
> Wrong direction: "copy the competitor's labels". Lifting "Select a Date & Time" (Web #17) or 24-hour times from the screenshots. Consequence: Title Case and 24-hour times break guide rules 2.1 and 3.5, and most example dates in the file are mm/dd.

---

## 7. Candidate directions

Scope note: Calendly changes what the design is. After the link is set, our picker never renders, and what the visitor sees in the middle of the journey is Calendly's own popup (a month grid plus times, as in Web #16 and #17). What is still ours: the card before it ("Request received" and "Book a time"), the failure state, the done screen, and the Calendly account settings that decide what the visitor sees (meeting length, slot step, notice, window, hours, time format). The spec also says the booking is embedded in the card, but the code opens a popup. A design that treats the picker as permanent is spending effort on the part that goes away. Also, before launch the link must be set, otherwise "Demo booked" is not true: nothing gets booked and nobody is told.

### Direction 1: Day strip, then that day's times (recommended)

What it is: a strip of dates you can page, a time list for the picked day, a one-line summary, and a Confirm button that names the action. Sample times differ by day, one sample day is fully booked, and "Pick another date" opens a calendar for far dates. It is the fix for rank 1 to 5 in section 2 at the lowest cost.

Desktop (modal, 480px):
```
+--------------------------------------------------+
| Pick a date and time                             |
| Demos take 30 minutes. All times are in India    |
| Standard Time (IST).                             |
|                                                  |
| Date                          November 2026      |
| ( < )  [Mon 16][Tue 17][Wed 18][Thu 19][Fri 20] ( > ) |
|        Pick another date                         |
|                                                  |
| Times on Wednesday, November 18                  |
| [10:00 am] [10:30 am] [11:30 am] [2:00 pm]       |
| [ 3:30 pm]                                       |
|                                                  |
| You picked Wednesday, November 18, 2026 at       |
| 11:30 am IST.                                    |
| [            Confirm demo time                 ] |
|                     Close                        |
+--------------------------------------------------+
```

Mobile (375px, bottom sheet, Confirm sticky):
```
+--------------------------------+
| Pick a date and time           |
| Demos take 30 minutes. Times   |
| are in India Standard Time     |
| (IST).                         |
| November 2026                  |
| [Mon 16][Tue 17][Wed 18][Th..  |   <- strip scrolls, edge cut off
|  Pick another date             |
| Times on Wednesday, November 18|
| [10:00 am] [10:30 am] [11:30 am]|
| [ 2:00 pm] [ 3:30 pm]          |
|--------------------------------|
| You picked Wed, Nov 18 at      |
| 11:30 am IST.                  |
| [     Confirm demo time      ] |
+--------------------------------+
```

Pros: fixes the independent-fields problem; rehearses Calendly's model (day first, then times); reuses the existing pill style and `nextWeekdays`; no new dependencies; the sample-full day lets the team design the empty state.
Cons: still throwaway; "Pick another date" needs a small calendar popover, so you may defer it and ship only the paging; per-day slots are made-up data.
Effort: low. One file plus its tests. `prototype-calendar.test.ts`, `demo-flow-nobooking.test.tsx` and `tests/e2e/try-demo.spec.ts` look for the dialog name "Pick a time", the button "Confirm time" and the chip "11:30 am", so they need updating with the copy.
After Calendly goes live: the picker is deleted. The frame work survives (zone and length lines, the restated-choice sentence, the done-screen echo, the empty-state copy).

### Direction 2: Month grid plus times (closest visual rehearsal of Calendly)

What it is: a compact month calendar with available days marked, and the time list for the picked day beside it on desktop or below it on phones.

Desktop (modal widened to about 720px):
```
+----------------------------------------------------------------+
| Pick a date and time                                           |
| Demos take 30 minutes. Times are in India Standard Time (IST). |
|                                                                |
|  ( < )  November 2026  ( > )     Wednesday, November 18        |
|  Mo Tu We Th Fr Sa Su            [10:00 am]                    |
|   2  3  4  5  6  .  .            [10:30 am]                    |
|   ...                            [11:30 am]  <- selected       |
|  16 17 [18] 19 20  .  .          [ 2:00 pm]                    |
|                                  [Confirm demo time]           |
+----------------------------------------------------------------+
```

Mobile (stacked, Confirm sticky):
```
+--------------------------------+
| Pick a date and time           |
| ( < ) November 2026 ( > )      |
| Mo Tu We Th Fr Sa Su           |
|  ...  16 17 [18] 19 20 . .     |
| Times on Wednesday, November 18|
| [10:00 am] [10:30 am] [11:30 am]|
|--------------------------------|
| [     Confirm demo time      ] |
+--------------------------------+
```

Pros: looks most like what visitors will meet (Web #16, #17); handles any horizon; availability marks are native to it.
Cons: no month-grid component exists in the repo and there is no date library in `package.json`; needs keyboard support; widens the modal; the 480px layout stops working.
Effort: high. A new accessible month grid with arrow-key navigation and month paging, plus layout work, for code that is deleted at launch.
After Calendly goes live: all of it is thrown away.

### Direction 3: Skip the custom picker and wire a Calendly test link now

What it is: set `CALENDLY_URL` to a test event on a real Calendly account, delete `PrototypeCalendar` and its tests, and spend the design time on the card before Calendly, the failure state and the done screen. Nothing on the card changes:
```
[ check ] Request received
Choose a time and we'll set up your demo.
[ Book a time -> ]     opens Calendly's own popup
```

Pros: nothing is thrown away; the team tests the true experience, including how it looks on a phone (a gap in the evidence); no made-up availability.
Cons: blocked on a person creating a Calendly account and event; you cannot control Calendly's layout, and how much of its look can be changed depends on the plan (outside the evidence); the tests that mock Calendly need rewriting.
Effort: low in code (a config value, a deletion and test edits), blocked on an owner for the account.
After Calendly goes live: this IS the live state.

### Recommendation

Build Direction 1, and make it disposable. It fixes the root cause from section 2 (a menu instead of slots) for a few hours of work, it rehearses the shape the real product will have, and it does not depend on anyone else. Keep it in one file with no new dependencies, and put a delete note at the top.

Ask one question today: can someone create a Calendly test event this week? If yes, switch to Direction 3 and do no more picker work at all, because every minute spent on the picker is spent on code that gets deleted. Direction 2 is the worst trade (highest cost, all of it thrown away), and the team's original idea is thrown away too, with less rehearsal value than Direction 1. In every case the frame work carries over, so put it first: a zone line, the demo length, the restated choice, a real done screen.

---

## 8. Where a human has to decide

The evidence cannot answer these. They need a person with context.

1. Demo length and buffer. This sets the slot step (15 or 30 minutes appear in 24 products, but ours should follow the demo). Who knows: whoever runs the demos.
2. Real availability: which days, which hours, whether same-day is allowed (the code never offers today), how far ahead, whether weekends are open. The code makes these decisions silently today.
3. How parents and centre admins differ. The Mobbin set has no Indian therapy-centre booking product (§5), so I do not know whether parents book from phones in the evening and admins from laptops in office hours. That is guesswork, not data.
4. Whether to keep any custom picker once Calendly is live. The code comment says delete it. Related: popup versus embedded in the card (the spec says embed, the code opens a popup), and whether to keep Calendly's own confirmation visible instead of closing it.
5. Whether the visitor may skip booking. The spec has a "Book later" link and a skipped state, but `demo-flow.ts` says there is no way past the schedule step except booking. Pin is the only product in the file with "Continue without scheduling" (Web #6). This is a business trade-off between lead capture and booking rate.
6. Whether any visitors are outside India, which decides if a time zone control is worth anything.
7. What Calendly gives back after a booking (date, time) and whether it is worth passing to our done screen. This is an engineering check against the live link, and it is outside the evidence.
8. How the day-first date style ("18 Nov") reads to Indian parents versus the guide's Month day order. This is a taste and trust call. See section 9.
9. What the visitor feels at the disabled button and at the 3-second redirect. Analytics will show where people leave. They will not show the hesitation.

Micro-exercise (about 15 minutes, one real person)
Find one person who could plausibly be a visitor: a parent, a therapist, a school coordinator. Not a designer. Hand them a phone with the live prototype open at the "Pick a time" step and say only: "You want a demo of this product. Book it for a time that suits you." Say nothing else.
1. Before they touch anything, ask: "When would you actually want it?" Write down the exact words. This tells you more about evenings, weekends and lead time than anything in this file.
2. Watch, and write down: which thumb moves first, whether they tap a time before a day, whether they pause at Confirm, and whether they look for another week.
3. After Confirm, ask without showing the screen: "What did you book, and what time zone?" Count how many get both right.
4. Do it again with a Direction 1 sketch (even a Figma prototype). Compare what they said in step 3.

---

## 9. Copy flags

Rule numbers refer to `guidelines/CBT-guidelines.md`. Per the repo rules, existing copy is flagged, not rewritten. Proposed copy is for the new picker only.

Existing copy

| Where | Text | Rule | Flag |
|---|---|---|---|
| `PrototypeCalendar` title | "Pick a time" | Consistent terminology (11) | The step picks a date and a time. The card button says "Book a time", the title says "Pick a time", the action says "Confirm time". Pick one word set. |
| `PrototypeCalendar` helper | "Sample times for the prototype. Times are in IST." | Clear and direct (1), 5.2 | "Prototype" is internal language shown to visitors. "IST" is not spelled out on first use. |
| Chip labels | "Wed, 18 Nov" | 3.4 | The guide's format is Month day, year. The day-first order here comes from the `en-IN` locale in the code. A month name is unambiguous, so clarity is not a reason to keep it. A real taste question for the team (section 8, item 8). |
| Time chips | "10:00 am" | 3.5 | Meets the guide. |
| Confirm button | "Confirm time" | 8.1 | Sentence case, no period. Correct, but it does not say what is being confirmed. |
| Disabled state | no text | 7, 6.2 | No reason given. |
| `DemoSchedule` error | "The calendar didn’t load. Try again, or we’ll email you." | 6.2, 7, 4.3 | Negative construction; "Try again" does not say how; two contractions in two sentences; "we’ll email you" is a promise the site has no backend to keep. Human check. |
| `DemoDone` | "Taking you to the homepage in 3s" | 5.2 | "3s" is an unspelled abbreviation. Write "3 seconds". |
| `tryDemoContent.submit` | "Submit & Book" | 2.1, 8.1 | A capital B mid-label breaks sentence case. "Submit & book" is the guide form. The spec also uses the capital. |
| Trust labels (outside the picker, noticed in passing) | "NIEPID validated", "JMIR-published outcomes" | 5.2 | Acronyms not spelled out on first use. |

Proposed copy for Direction 1 (the demo length of 30 minutes is an assumption, and needs confirming)

| Element | Proposed | Rule |
|---|---|---|
| Dialog title | Pick a date and time | 2.1, 11 |
| Subline | Demos take 30 minutes. All times are in India Standard Time (IST). | 3.1 numeral for a measurement, 5.2 spell out first use, 4.1 full sentence with a period |
| Date legend, link | Date. Pick another date | 8.1, 4.1 no period on a link or button |
| Month label (strip) | November 2026 | 3.4 |
| Date chip | Wed 18, under the month label, with an accessible name "Wednesday, November 18, 2026". If the month must be on the chip: Wed, Nov 18 | 3.4. The short form is a clarity-over-correctness trade for space. The long date appears in full in the summary and done screen. |
| Time legend | Times on Wednesday, November 18 | 3.4 |
| Time chip | 11:30 am | 3.5 |
| Summary | You picked Wednesday, November 18, 2026 at 11:30 am IST. | 3.4, 3.5, 5.3 you, 6.1 active voice, 5.2 (IST is fine now, since the subline spelled it out on this screen) |
| Hint while disabled | Choose a date and time to book your demo. | 5.3, 6.2 affirmative, 7 helpful |
| Confirm | Confirm demo time | 8.1 |
| Close | Close | 8.1 |
| Full day | Next available: Thursday, November 19 at 10:00 am. Wednesday, November 18 is fully booked. Button: Go to Thursday, November 19 | 7 specific, with a fix; 6.2 leads with the affirmative. "Fully booked" is a negative fact, kept because it is specific. |
| Done screen line (new, before the existing email line) | Your demo is booked for Wednesday, November 18, 2026 at 11:30 am India Standard Time (IST). | 3.4, 3.5, 5.2 (a new screen, so spell it out again) |
| Temporary prototype note, if it must stay visible | Sample times only. | 4.1. A human should decide whether it belongs on a public page at all. |

Things not to copy from the evidence: Calendly's "Select a Date & Time" (Web #17) and Motion's "Schedule Event" (Web #31) are Title Case, which breaks 2.1 and 8.1. Many example times are 24-hour (Web #5, #6, #16), which breaks 3.5. The Calendly example in Web #16 is 24-hour, so when the link is set, check which time format Calendly shows. The guide wants 12-hour with am and pm, and the research does not say whether that is configurable.

---

Checked (against the research file's own rows): Web #4, #5, #6, #7, #13, #16, #17, #22, #24, #29, #38, #39, #43, #45, #46, #52; iOS #5, #10, #11, #17, #32; Flow #1, #3, #5, #6. Counts of 99 screens, 53 web, 46 iOS, 8 flows and 78 distinct products re-counted from the tables with a script, all match. The step counts in insight 4 (15 minutes: 13 products, 30 minutes: 11) match the lists in §4.

Looked off or weak: Web #13 (Preply) says its chips are not in chronological order, which is likely a preview misread. Web #22 (Headspace) shows "13:00 PM", which is not a valid time, so I did not use it. §4G omits Braintrust (Web #14), which has a changeable zone link. The §4 24-hour list omits HubSpot (Web #43) and Time2book (#38), so the 24-hour count is slightly low. §4A lists the Fresha iOS sheet (iOS #3) as month plus times, but that sheet shows no exact times. Flow #7 (Alan) mixes preview images from four flows, so I used it for nothing. Mobbin shows example data (US and Southeast Asian dates, mock names, odd durations such as "5 hours" in Web #18), so the date-order split in insight 5 reflects sample data and locale, and does not show what each product chooses for India.
