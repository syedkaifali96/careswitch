# Project scope, judging fit and next steps

## Product purpose

CareSwitch explores a way to express a few clear preferences during a care conversation when speech or hand interaction is difficult but comfortable voluntary head movement is available. A nearby helper can assist with setup. It is a solo student communication prototype, not a disease-specific intervention or an emergency system.

The differentiating idea is the integration of on-device head input, a reviewable silent draft, separate confirmation and free local speech across eight prepared packs. A general LLM can answer typed questions; this prototype focuses on reaching and deliberately selecting messages without typing. Head-input and communication-board concepts already exist, so originality is claimed only for this project implementation and combination, not a new invention of assistive communication.

## Delivered scope

The current app implements five-position calibration, six editable phrases per pack, a steady in-app pointer, timed hold, Confirm/Cancel, pause/release behavior, direct-input alternatives, responsive layouts and local speech fallback. Architecture and data handling are documented. The source, four tests, PDFs, story and uploaded presentation are prepared.

Not implemented: arbitrary hands-free typing, operating-system cursor control, eye gaze, automatic translation, fully localized UI, saved profiles, a patient database, caregiver notifications, medical advice or an installed offline app. Settings/editing may require a helper. No paid API is required; no future free-service quota is assumed.

## How it fits judging

| Criterion | Evidence a judge can assess | Current gap |
| --- | --- | --- |
| Idea | Healthcare communication problem; input barrier addressed without medical inference | Intended-user benefit has not been established through trials |
| Implementation | Real bundled landmark inference, calibration/filtering/dwell, cancellation handling, local speech, source and regression tests | Device performance and real-user accidental activation need evaluation |
| Design | Large choices, explicit review/confirmation, input alternatives, responsive views and RTL messages | English surrounding UI; no formal accessibility or intended-user usability audit |
| Presentation | Public interactive demo, 2:57 video, one-page description and full code package | Video uses edited mouse-mode captures; live head workflow is explained rather than recorded |

These are qualitative strengths and gaps, not predicted scores or a guarantee of winning.

## Priorities before submission

1. Finish the creator's review of this package and verify a comfortable selection/confirmation plus English/Urdu listening on the actual laptop.
2. If available, perform a physical-phone touch/audio check and fluent-speaker review; report actual results and unresolved limits.
3. Publish accepted docs/code-PDF updates and replace the old Devpost attachment. Confirm the public demo, video and story links still work.
4. Recheck the organizer's conflicting date information, review declarations/parent or guardian consent, and obtain final submission authorization. The entry is currently paused, not submitted.

An optional voluntary live head-control clip could strengthen a later presentation revision. Longer-term work should follow consent-based intended-user and accessibility-specialist feedback: comfortable setup, fatigue, target layout, localization and alternative input. These ideas are future work, not current product features.

See the [submission checklist](submission-checklist.md) for actual deadlines/status and [verification](verification.md) for the distinction between automated evidence, browser tests, creator reports and unknown outcomes.
