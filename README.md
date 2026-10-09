# CareSwitch

**Your movement. Your message.** An on-device, head-controlled communication board with free multilingual speech.

Built by **Syed Kaif Ali**, a solo student participant, for **DSH Hacks V2: AI × Healthcare**. AI tools assisted planning, coding, debugging, UI refinement, testing and documentation. This is an interactive student prototype, with no clinical validation or intended-user trial.

[Try the public demo](https://syedkaifali96.github.io/careswitch/) · [Watch the 2:57 presentation](https://youtu.be/PYqF6pDfuLU) · [GitHub](https://github.com/syedkaifali96/careswitch) · [Devpost draft](https://devpost.com/software/careswitch)

## Problem and intended use

A person may know what they want to say but find speaking or using their hands difficult. During a conversation at home or in a care setting, expressing “Yes”, “Please explain that again”, or “I need a break” can help them communicate a preference.

CareSwitch explores an input option for people who can comfortably and voluntarily move their head, with a nearby helper if setup assistance is needed. A webcam guides a pointer to a small board of editable phrases. The user reviews and confirms the exact message before it is displayed and read aloud. Potential benefits are hypotheses until tested with intended users.

The AI addresses an **input barrier**: a pretrained model finds face landmarks locally. The app does not require typing a prompt, generate medical answers, or infer what the person wants. Existing communication and head-input tools already exist; no world-first claim is made.

## Implemented features

- Five-step movement calibration: center, left, right, up and down. This uses nose-landmark position, not eye-gaze tracking or an operating-system cursor.
- Six editable cards; timed hold selects a silent draft. Separate Confirm/Cancel controls and a required pointer release reduce unintended repeated activation.
- Median filtering, deadband, smoothing and a speed limit; adjustable hold time and sensitivity.
- Tracking loss, multiple faces, stale tracking and open dialogs stop dwell selection. Hiding the tab stops the camera.
- Prepared message packs in English, Urdu, Arabic, Hindi, Spanish, French, German and Chinese; right-to-left message display for Urdu and Arabic.
- A matching local device voice, with a bundled free eSpeak NG fallback. Confirmed text remains visible if playback fails; Read again retries.
- Mouse, touch and keyboard alternatives, customizable phrases and responsive layouts.

Setup instructions and surrounding UI remain **English**. eSpeak NG is rule-based synthetic speech, not a neural voice. Arabic custom text needs vowel marks; the Chinese fallback uses Mandarin. There is no paid AI service, participant-supplied API key, account, patient database or app upload of camera frames/messages. However, the bundled MediaPipe runtime contains active performance/usage telemetry to Google; local inference does not mean zero external requests. See the [API/network audit](docs/api-network-audit.md).

## Try it in two minutes

1. Open the public demo. Click or tap “I need a break.”
2. Review the silent draft. Click **Confirm message** to display and read it, or **Cancel** to discard it.
3. Change **Message language** to try another prepared pack. Under **Settings → Voice**, choose **Free built-in voice** to test the fallback.
4. For camera input, click **Enable camera**, allow access, and complete all five comfortable movement prompts. If only the preview appears, click **Set my movement range**.
5. Move the pointer into empty space, then onto a card. Hold for the configured time. After selection, leave the targets before moving onto Confirm or Cancel and holding again.
6. Pause or turn the camera off when needed. Recalibrate if the camera or your seating position changes.

The first model/speech download can take time. The speech WASM alone is about 18.5 MB; if it times out, wait for the connection to settle and press **Read again**. See the [user guide and troubleshooting](docs/user-guide.md).

## Run the included code locally

There is no build step or server application. Extract the ZIP and open a terminal in its root. If Python 3 is installed:

```sh
python -m http.server 4174 --bind 127.0.0.1 --directory dist
```

Open **http://localhost:4174/**. Alternatively, with Node.js installed:

```sh
npx --yes http-server dist -p 4174 -a 127.0.0.1
```

The Node alternative downloads a serving tool on first use. Camera access needs HTTPS or localhost. Opening `index.html` directly as a file is insufficient for the worker/camera workflow. The public site needs a connection for initial assets; this is not an installable offline app and browser caching is not guaranteed.

Requirements: a modern browser with Web Workers, WebAssembly, Web Audio and camera-frame support; a webcam is optional for practice. Chrome/Edge are suggested by the app's error guidance. Minimum RAM, physical-phone compatibility and comfortable performance on an 8 GB laptop have not been established by a device benchmark.

## Structure and documentation

| Path | Contents |
| --- | --- |
| `dist/` | Runnable app, bundled model, runtime assets and upstream licenses |
| `tests/` | Four Node.js regression test scripts |
| `docs/` | Guides, project scope, architecture, evidence, presentation materials and PDFs |
| `FILE-MANIFEST.json` | SHA-256 and size of every other file in this review ZIP |

Read the [documentation index](docs/index.md), [architecture](docs/architecture.md), [privacy and safety](docs/privacy-and-safety.md), [verification record](docs/verification.md) and [third-party notices](docs/third-party-notices.md). Review the [one-page description](docs/CareSwitch-project-description.pdf), [25-page code PDF](docs/CareSwitch-code.pdf) and [English project story](docs/devpost-description.md).

With Node.js installed, run each check from the package root:

```sh
node tests/core-test.mjs
node tests/pointer-test.mjs
node tests/camera-test.mjs
node tests/speech-test.mjs
```

These test logic and mocked failure cases. Actual-model browser checks and their limits are recorded separately in verification; the four scripts alone do not validate real webcam usability or pronunciation.

## Current review status — 10 October 2026

The demo and repository are public. The presentation is uploaded Unlisted to YouTube and its link is saved in Devpost. It uses edited actual app captures in mouse practice mode with synthetic English narration; live head tracking is explained, not recorded.

Devpost remains a **draft, 4/5 steps done**. Final agreement and Submit are paused at the creator's request. The previous source ZIP is still attached there; this revised ZIP has not been uploaded. Updated documentation and the reviewed code PDF are included in this repository revision. Parent/guardian consent and final Rules/Terms agreement have not been confirmed in this conversation. See the [submission checklist](docs/submission-checklist.md) for the deadline discrepancy and remaining actions.

Third-party licenses remain attached to their components. No blanket first-party open-source license has been selected in this package; see the notices before redistribution.
