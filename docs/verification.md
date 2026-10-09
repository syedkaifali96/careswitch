# CareSwitch verification record

Consolidated 10 October 2026. Earlier checks took place during development on 7–9 October; the source-ZIP regression run and package review were checked on 10 October. No app code was changed by the current documentation revision.

## Evidence and its scope

| Area | Observed result | What it establishes / does not establish |
| --- | --- | --- |
| Four extracted ZIP tests | All passed: core, pointer, camera and speech | Deterministic logic/failure checks; not real-user or clinical validation |
| Actual bundled face model in a browser worker | Public portrait sample: one face, 478 landmarks; blank: zero; two-portrait composite: two and no usable pointer | Real inference on test images; no participant webcam or intended-user trial |
| Synthetic camera stream | Local sample-image stream completed startup and five calibration steps; pointer appeared | Browser integration with the real model, not voluntary human head movement |
| Creator's laptop report | Creator reported head control working and later that the app worked after adjustments | User report, not agent-measured accuracy, comfort, frame rate or benchmark |
| Card interaction | Silent draft, Confirm, Cancel, previous confirmed output, mouse dwell and separate release checked | Observed board workflow in browser practice mode |
| Responsive layouts | 1440×900, 768×1024, 390×844, 320×568 and 844×390; no horizontal overflow in checked layouts | Browser viewport checks, not trials on physical phones |
| Text / keyboard | Urdu right-to-left draft, custom phrases, focus transfer/return and compact setup controls checked | Specific observed examples, not all text lengths/writing systems or formal accessibility audit |
| Actual free speech engine | Non-silent WAV generated and browser playback completed for all eight packs and a custom Urdu phrase | Audio generation/playback status; not fluent-speaker pronunciation approval or audibility on every device |
| Public GitHub Pages | Draft/Confirm worked; English and Urdu free playback completed after retrying one initial download timeout | Public browser integration, with a real observed first-load limitation |
| Optional model-context tool | Valid staging returned `confirmed: false`; invalid ID rejected | Tested experimental draft-only integration; not available in every browser |
| Published presentation | YouTube watch playback advanced; about 2:57 duration, Unlisted, no player error in the check | Accessible uploaded presentation; no live head-control footage |

The agent did not open or record the user's real camera. Public sample-image fixtures and synthetic video harnesses are excluded from the deployed app and submission ZIP.

## Regression tests

Run from the package root with Node.js; no npm install is required for these scripts.

```sh
node tests/core-test.mjs
node tests/pointer-test.mjs
node tests/camera-test.mjs
node tests/speech-test.mjs
```

| Script | Covered cases |
| --- | --- |
| `core-test.mjs` | Mirrored/vertical calibration, insufficient samples/range, invalid coordinates, one stationary activation, target changes and tracking gaps |
| `pointer-test.mjs` | Small jitter, isolated spikes, speed bounds, deliberate movement, long frame gaps, resets, 30/60 Hz response consistency and edge reach |
| `camera-test.mjs` | Pending play promise with usable frames, delayed frames, no-frame timeout, canceled startup and playback rejection |
| `speech-test.mjs` | Local-only native voice selection, stale/canceled audio suppression, stopping audio, canceled callbacks, forced free voice, worker failure and blocked audio |

Speech and camera tests use controlled substitutes to verify failure paths. They are supplemented by the actual model/engine browser checks above. JavaScript syntax checks also passed during implementation.

## Resolved development issues

- Camera preview could play while its `play()` promise stayed pending. Startup now checks usable frames with timeout/cancellation, allowing calibration to begin.
- Early pointer movement was jittery/fast. Median filtering, deadband, smoothing and a speed limit were added; defaults are 0.8× sensitivity and Strong smoothing. The creator later reported the app working.
- Earlier versions depended on installed voices and showed Urdu as text only. The **current** bundle adds free speech for all eight prepared packs; fluent-speaker review is still outstanding.
- Compact layouts previously hid setup controls. Checked controls now remain available; settings scroll internally on short viewports.

## Current package review

The subsequent API/network source audit found MediaPipe's active usage/performance logger. Earlier wording that only hosting/asset requests existed was incomplete and is corrected in the current Markdown. No camera frames or messages were found in the logger's metrics construction, and Google's official notice says inputs are processed on device. Actual live network requests were not recorded by this source audit; zero external traffic is not claimed. See the [API/network audit](api-network-audit.md).

ZIP integrity, payload hashes, documentation UTF-8 and relative file links are checked by the packaging audit. The deployed app/assets, four tests, one-page PDF, 25-page reviewed code PDF and presentation bytes are preserved from the previously reviewed package. The code PDF includes nine first-party deployed source files and all four test scripts; third-party binaries remain in `dist/assets/`.

Original review found no private configuration paths, camera/sample images or recognized API-key/private-key patterns. Pattern scanning cannot guarantee the absence of every possible secret. This Markdown revision does not create a new functional test result.

## Remaining evaluation

1. On the creator's physical laptop, repeat comfortable calibration, selection, release, Confirm/Cancel and English/Urdu free-voice listening together; document the observed outcome.
2. On a physical phone, test touch, dialogs, scrolling and audio permissions; camera input performance is a separate device check.
3. Ask fluent speakers to assess prepared translations and pronunciation, especially Arabic custom text and Mandarin.
4. With appropriate consent, obtain intended-user and accessibility-specialist feedback on fatigue, accidental activation, reachable targets and helper-assisted setup.

No physical-phone benchmark, every-language/device guarantee, intended-user trial, accessibility certification, clinical outcome or minimum-RAM benchmark is claimed. See [privacy and safety](privacy-and-safety.md) and [submission status](submission-checklist.md).
