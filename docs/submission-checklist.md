# CareSwitch submission checklist

Review snapshot: **10 October 2026**, before ZIP replacement. Prepared materials and a saved draft are not a completed submission.

## Organizer requirements and deadline

Sources checked during preparation: [overview](https://dsh-hacks-v2.devpost.com/), [Official Rules](https://dsh-hacks-v2.devpost.com/rules), [deadline extension](https://dsh-hacks-v2.devpost.com/updates/46714-submission-deadline-extended).

The organizer requests an interactive coding prototype, a demo video explaining purpose/features/user interaction, a one-page description PDF, and “Github Repository / Code PDF”. Explanatory text also asks for a code PDF; both a repository and PDF are prepared. Student eligibility is age 13+ and AI assistance is permitted. The 2–3 minute target is our presentation choice, not a verified official duration limit.

The latest overview/extension displays **14 November 2026, 11:45 PM PST = 15 November 2026, 12:45 PM Pakistan time**. The Rules body still lists June 24–November 8. Treat this as a discrepancy: recheck the organizer pages before relying on a deadline, aim to be ready by November 7, and do not infer revised judging/winner dates from the old text.

## Materials and saved state

| Requirement / field | Current state |
| --- | --- |
| Interactive prototype | Public [GitHub Pages demo](https://syedkaifali96.github.io/careswitch/) and runnable `dist/` in ZIP |
| Source | Public [GitHub repository](https://github.com/syedkaifali96/careswitch); four tests included |
| Description | [One-page PDF](CareSwitch-project-description.pdf), included in ZIP; existing public PDF link saved in story |
| Code PDF | [Reviewed 25-page PDF](CareSwitch-code.pdf), app plus tests, included in newest ZIP; included in this repository revision |
| Video | [2:57 Unlisted YouTube presentation](https://youtu.be/PYqF6pDfuLU), playback checked and URL saved in Devpost |
| Cover / gallery | Cover thumbnail and three images saved in draft |
| Team | Creator is the sole member; draft submission ID 1227270 |
| Additional attachment | **Original `CareSwitch-source.zip`, 23.44 MiB**, remains attached in Devpost |
| Latest reviewed attachment | **`CareSwitch-submission-final-review.zip`**, local only, not uploaded to Devpost |
| Corrected Markdown | Included in this repository revision and newest review ZIP |
| Award options | Standard 1st/2nd/3rd Place selected; no sponsor-specific extra award selected |
| Finalization | **4/5 steps done, draft; final agreement unchecked; Submit not pressed** |

## Outstanding submission actions

- [ ] Creator reviews the corrected documents, source scope and presentation limitations.
- [ ] Replace Devpost's old ZIP with the accepted reviewed package and verify the saved attachment, under the form's 35 MB limit.
- [ ] Verify publication of this documentation/code-PDF revision and check public links again.
- [ ] Confirm appropriate parent/guardian consent and the participant's agreement to [Official Rules](https://dsh-hacks-v2.devpost.com/rules) and [Devpost Terms](https://info.devpost.com/legal/terms-of-service). These have **not** been affirmed in this conversation.
- [ ] Obtain the creator's authorization to proceed with final submission; the creator expressly paused it for ZIP review.
- [ ] Only then complete the final agreement and submit; verify the actual successful submission status.

## Recommended evaluation, separate from organizer requirements

The creator reported laptop head control working. Automated and browser evidence is recorded in [verification](verification.md). Physical-phone trials, current real-device voice listening, fluent-speaker review and intended-user evaluation remain outstanding. These are honest prototype evaluation gaps; they are not represented as additional official submission fields.

## Presentation claims to preserve

The published video shows edited real app screenshots in mouse practice mode with synthetic narration and burned-in captions. It explains head control, rather than recording live head movement. No patient trial is shown. Setup/UI remains English; only eight prepared packs are supplied. Speech is rule-based. No diagnosis, treatment, emergency alerts, caregiver contact, eye-gaze control, world-first invention or clinical validation is claimed.

## Dependency privacy follow-up

The [source audit](api-network-audit.md) found an active Google usage/performance logger inside the bundled MediaPipe runtime. This does not make inference a paid cloud API, but it means the current app must not promise zero external requests. Before wider use, address telemetry blocking or a suitable informed-consent approach and validate actual network behavior. The documents disclose the enabled logger, and the updated story is saved in Devpost. Runtime code is unchanged; telemetry is intentionally left enabled at the creator's request.
