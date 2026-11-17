# Calendly plans: what Free and paid give the try-demo flow

Date researched: 2026-11-13. Method: Calendly's own pricing and help pages, its developer docs, and (where official pages are silent) third-party reviews. Plans and prices change, so re-check the pricing page before buying. Nothing here was tested in a live Calendly account.

## Plan names

Calendly's current plans are Free, Standard, Teams and Enterprise. There is no current plan called Pro. The legacy Professional plan maps to Standard (or Teams if you used routing, managed events and groups). Source: legacy plans page.

| Plan | Price on the pricing page | Notes |
|---|---|---|
| Free | $0 | |
| Standard | $10 per seat per month | The page shows a "Save 17%" yearly toggle. It does not say which billing option $10 reflects. Inference: $10 is the yearly rate and monthly is about $12 (third-party pages quote $12). Unconfirmed. |
| Teams | $16 per seat per month | "Save 20%" toggle. Same billing ambiguity. |
| Enterprise | From $15k per year, 50 seats minimum, USD only | |

A seat is a host who connects a calendar. Invitees (our visitors) do not need a seat. Prices are in USD. A free trial length is not stated on the pricing page.

## What each plan includes (features that matter to us)

| Feature | Free | Standard | Teams | Source status |
|---|---|---|---|---|
| Event types | 1 | Unlimited | Unlimited | Official |
| Calendars checked for conflicts | 1 | Up to 6 | Up to 6 | Official |
| Unlimited meetings and invitees | Yes | Yes | Yes | Official |
| Confirmation emails | Yes | Yes | Yes | Official |
| Reminders and Automations (workflows) | Not on the plan | Yes | Yes | Official page lists it under Standard. Third-party sources disagree on whether Free sends any reminder. |
| Remove "Powered by Calendly" branding | No | Yes | Yes | Official, explicit |
| Embed colors and popup button text | No | Yes ("paid plan") | Yes | Help page says "paid plan". The pricing page puts it under Standard. |
| Custom confirmation page and redirect after booking | No | Yes | Yes | Pricing page. Third-party sources agree. |
| Payments (Stripe, PayPal) | No | Yes | Yes | Official, explicit ("Standard plan and above") |
| Group and collective events | No | Yes | Yes | Official |
| Zapier, HubSpot, Mailchimp connections | No | Yes | Yes | Official |
| Round robin, routing forms, managed event types | No | No | Yes | Official |
| Salesforce, Marketo and Pardot | No | No | Yes | Official |
| SSO, audit log, domain control | No | No | No (Enterprise) | Official |
| Analytics (Google Analytics, Meta Pixel) | Not listed | Yes | Yes | Pricing page |

## Settings that decide what the visitor sees

| Setting | Plan | Source status |
|---|---|---|
| Booking window (rolling days, fixed range, weekdays only) | Help page says "All plans". No per-plan limit stated. | Official. Not verified on a Free account. |
| Minimum scheduling notice | Same as above | Same as above |
| Buffers before and after | Same as above | Same as above |
| Start time increments (slot spacing) | Same as above | Same as above |
| Meeting length | Set per event type | Official. Whether Free allows several length options is not stated. |
| Invitee questions | Per event type, so Free has one question set | Official for the setting. Free behaviour is inference. |
| Lock invitee time zone | Not stated | Official, plan not stated. Calendly recommends it for in-person events only. |

## How the booking behaves for the visitor

- Time zone: Calendly detects the visitor's zone from their device settings (a community reply says it can also use IP address and sometimes gets it wrong). The visitor can change it from a menu under the calendar.
- 12-hour or 24-hour time: the invitee controls it with a toggle in that zone menu. A host cannot force 12-hour. Calendly staff described forcing it as a feature request. This conflicts with guide rule 3.5 (12-hour times with am and pm) for anything inside Calendly's popup. We cannot control that copy.
- Language: Calendly says the invitee's experience can be translated automatically. How it detects the language, and whether it can be fixed, was not found.

## Embed facts for our code

- Our code uses the popup widget: `initPopupWidget` with a prefill of name, first name, last name and email. Calendly documents prefill for embeds. Plan not stated, so assume all plans.
- Calendly sends `calendly.event_scheduled` to the page by `postMessage`. The embed help pages are labelled "All plans" and state no plan restriction for the events.
- The `event_scheduled` payload carries only `payload.event.uri` and `payload.invitee.uri`. It has no date or time. `calendly.date_and_time_selected` has an empty payload. So our page cannot show "booked for Wednesday at 11:30 am" from the message alone. Getting the time needs the Calendly API with the event URI (needs a token, so a backend), or leaving Calendly's own confirmation screen visible (our code currently closes it).
- Iframe embeds do not support event tracking. The JavaScript embed does.
- Popup branding: turning off branding in account settings does not update popup code already on a site. The branding option must also be set to false in the embed script.
- `hide_gdpr_banner` is documented for embeds. A `hide_event_type_details` parameter name appears only in a community post. The UI option "Hide Event Details" is official. Treat the parameter name as unverified.
- Prefilled fields stay editable. Calendly has no read-only option for them.

## Conflicting or unverified

- Webhooks and the Scheduling API on Free: the newest developer FAQ and a community announcement say they work on every plan including Free (rate limited, 5 bookings per user per day through the API). Older pages and the Introduction page say a paid plan is required. The pricing page extract listed webhooks under Free but its tick marks were not readable. Confirm in an account before relying on it.
- Reminders on Free: sources conflict (see table).
- Which availability settings Free allows: the help pages say "All plans" without a per-setting breakdown. Test it.
- Whether the popup still shows the "Powered by Calendly" badge on Free in 2026: the help page says branding is on by default and removal is paid.
- Free trial length: not stated.

## What this means for the picker decision

1. Direction 3 (set `CALENDLY_URL`, delete `PrototypeCalendar`) works on Free for the core need: one demo event type, prefill, and `event_scheduled` to move our flow to the done screen.
2. Free cannot recolor the popup (stays Calendly's own look) or remove Calendly branding. That needs Standard.
3. One event type means one length and one question set. Separate demos per audience (therapist, parent, centre, school) need Standard.
4. Reminders to cut no-shows need Standard.
5. Echoing the booked date and time on our done screen is not possible from the message alone.
6. Use the 10-minute test below before paying for anything.

## 10-minute test on a free account

1. Create a free Calendly account and one event type called Demo, with the real length.
2. Set the booking window, minimum notice, buffer and start time increment. Note any setting that asks for an upgrade.
3. Set `CALENDLY_URL` locally, run the site, submit the form, tap Book a time.
4. Check on a phone: how the popup looks, the zone label, the 12-hour or 24-hour display, and the Calendly badge.
5. Book a slot. Confirm our page moves to the done screen. Note what the visitor sees from Calendly before that.

## Sources

- https://calendly.com/pricing
- https://calendly.com/help/choose-the-right-calendly-plan-for-your-team
- https://calendly.com/help/calendly-s-legacy-plans
- https://calendly.com/help/how-to-customize-your-embed
- https://calendly.com/help/advanced-calendly-embed-for-developers
- https://calendly.com/help/calendly-embed-and-the-api
- https://developer.calendly.com/api-docs/overview/embedding/notifying-the-parent-window
- https://calendly.com/help/how-to-turn-off-calendly-branding-on-your-scheduling-page
- https://calendly.com/help/how-to-fine-tune-your-availability-settings
- https://calendly.com/help/how-to-customize-your-event-types
- https://developer.calendly.com/docs/getting-started/frequently-asked-questions
- https://help.calendly.com/hc/en-us/articles/31619360031383-How-to-pre-fill-invitee-information-in-an-embed
- https://community.calendly.com/how-do-i-40/force-time-format-to-12h-am-pm-on-booking-page-for-everyone-3220
- https://cal.com/blog/is-calendly-free (third party, a Calendly competitor)
- https://meetergo.com/en/magazine/free-calendly (third party)
