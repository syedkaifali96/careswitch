# AI API and network source audit — 10 October 2026

## Answer

**CareSwitch has no paid hosted AI inference integration and requires no participant API key.** The face model and speech fallback execute in the browser. There is, however, active Google usage/performance logging code in the bundled MediaPipe runtime. Therefore “no paid cloud AI API” is accurate, while “no external requests except assets” is not accurate for the current package.

## Findings

| Question | Evidence / result |
| --- | --- |
| OpenAI, Gemini, Claude or another hosted model call? | No such endpoint or integration found in the nine first-party app files |
| API key or paid account needed to run? | None supplied/read by first-party app code; no billing setup or environment configuration required |
| How does the AI run? | `vision-worker.js` loads bundled MediaPipe JavaScript, WASM and `face_landmarker.task`, then runs local `detectForVideo` |
| How does speech run? | Matching browser-marked `localService` voice, or bundled eSpeak NG WASM in `speech-worker.mjs` with Web Audio playback |
| Does speech send the phrase to a server? | First-party speech worker fetches its own WASM asset and generates local virtual text/WAV files; no remote text-to-speech request found |
| Are camera frames uploaded by app code? | Frames are transferred to a local vision worker for inference; no frame/message upload found |
| Does the dependency contain another request? | Yes: `vision_bundle.js` and `.mjs` include a metrics logger posting to `https://odml.pa.googleapis.com/v1/log` |
| Is that logger merely an unused URL? | Source initialization constructs the logger for a new task; it queues startup/performance events and has a 60-second flush timer. Task close can flush too |
| Is its service header the student's API key? | The SDK obtains its own logging value internally. This is not a participant-provided hosted-model credential or a user billing integration; no value was printed or extracted |
| Was an actual telemetry request observed in this audit? | No. This was source/package inspection, not a live network capture; delivery may depend on permissions/network/browser behavior |

The local runtime's logger builds SDK/task/platform and performance-count/timing events. The source inspected here did not include camera frames or chosen phrases in that construction. Google's [official MediaPipe privacy notice](https://github.com/google-ai-edge/mediapipe#privacy-notice) likewise states that input processing occurs on device while usage/performance metrics are sent to Google. Its [Terms page](https://developers.google.com/edge/mediapipe/legal/tos) describes metrics and consent responsibilities. This document is a technical inventory, not legal compliance certification.

Other embedded upstream URLs were documentation/example references in generated WASM loaders, plus the SVG namespace in HTML. A string's presence alone does not establish a network call; the logger was assessed separately by following its construction and send path.

## Checks performed

- Read the actual first-party camera, vision, speech and HTML startup code; searched network APIs/endpoints and key patterns.
- Inspected the bundled dependency's logger constructor, initialization, timer, event construction and POST path.
- Verified ZIP integrity, all manifest hashes/sizes and byte identity of the extracted runnable app.
- No recognized API-key/private-key patterns were found in the scanned runtime text. Pattern scanning is not an exhaustive security audit.

## Current limitation and follow-up

The application and dependency bytes are unchanged by this audit. Telemetry is **not blocked** in the current deployed app/review ZIP. Corrected Markdown discloses it. The creator chose to leave logging enabled. No new live network test or metrics-consent implementation is claimed.

Before wider use, address this dependency logging path, then verify it with a network trace while ensuring model loading, inference and speech still work. Any later change must update the source manifest, code PDF and submission package together. Initial asset downloads still need a network connection even if logging is later blocked.
