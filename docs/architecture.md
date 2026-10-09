# CareSwitch architecture

## Stack and deployment

CareSwitch is a static HTML/CSS/JavaScript application. `dist/` is the runnable source and deployment directory; no bundler, backend, database, login, secret or paid API key is required. The public GitHub Pages deployment serves a copy from the repository's `docs/` directory. In this submission ZIP, `docs/` contains documentation/materials and `dist/` remains the app to serve.

Pretrained MediaPipe Face Landmarker is the AI component. It detects landmarks; CareSwitch trains no new model and uses no LLM. eSpeak NG provides rule-based speech, with browser-native local speech as the preferred option when available.

## Camera-to-message flow

```text
Camera permission → local video frames → vision Web Worker
  → face count + nose landmark + timestamp
  → five-position calibration → normalized in-app pointer
  → median/deadband/smoothing/speed cap → target hit test
  → dwell gate → silent draft → release → Confirm / Cancel
  → confirmed text → local native voice or speech worker → device audio
```

App assets are fetched from the host. Frames go to a worker in the same browser, not to a remote model service. The unmodified MediaPipe runtime also initializes a usage/performance logger with an external Google endpoint; this package does not disable it. No live network trace was captured in the current audit, so actual request success on a given device is not claimed. See the [API/network audit](api-network-audit.md). Face identification, eye gaze, emotions and health conditions are not inferred.

## File responsibilities

| First-party file | Responsibility |
| --- | --- |
| `index.html` | Accessible native controls, dialogs, camera preview and output |
| `styles.css` | Responsive board, focus states, pointer and compact layouts |
| `app.mjs` | UI state, events, camera lifecycle, calibration sequence and target activation |
| `core.mjs` | Calibration medians, nonlinear coordinate mapping and dwell gate |
| `pointer.mjs` | Three-sample median, 8 px deadband, smoothing and 480 px/s cap |
| `camera.mjs` | Wait for usable video frames with cancellation and a bounded timeout |
| `vision-worker.js` | MediaPipe model loading/inference and bitmap cleanup |
| `speech.mjs` | Local voice choice, fallback, cancellation epochs, cache and playback status |
| `speech-worker.mjs` | Bundled eSpeak NG compilation, local virtual text/WAV files and synthesis queue |

## Tracking and calibration

The model runs in VIDEO mode on CPU, configured for up to two faces so that an extra face can stop selection. Detection/presence/tracking confidence thresholds are 0.6. One bitmap is processed at a time, with an approximately 85 ms scheduling interval; this is not a guaranteed frame rate.

Only when exactly one fresh face is detected does the app use landmark index 1 (nose). Each of the five positions allows a one-second settling period, then samples until about three seconds. A position needs at least eight samples. Medians define center and the movement edges; inadequate range or center outside the edges is rejected.

Mapping adjusts for the observed horizontal/vertical directions and clamps to the board range. Sensitivity changes the response curve, preserving the calibrated edges. Filtering then steadies the pointer; the median/deadband and speed cap are heuristics, not clinically validated movement controls.

## Selection states and interruption

The interaction is `ready → draft → confirmed` or `ready → draft → cancel`. A draft disables other message cards. A 600 ms cooldown and leaving active targets separate selection from the next dwell. A stationary target fires once until released. Changing targets or a frame gap over 350 ms resets accumulated dwell.

Missing/multiple faces, stale tracking, open dialogs and invalid pointer state stop dwell. Camera-start epochs prevent canceled startup work from reactivating it. Hiding/leaving the page stops camera tracks; a stalled worker has a timeout. Mouse/touch/native keyboard buttons provide alternative interaction.

## Speech and state

Automatic mode selects a matching `localService` browser voice; otherwise the speech worker builds a WAV locally using bundled eSpeak NG and plays it through Web Audio. Eight language codes are mapped explicitly; Chinese uses `cmn`. Speech requests require nonempty text up to 160 characters. Up to eight decoded messages are cached in browser memory.

Cancellation epochs suppress late synthesis or native callbacks after newer playback, Clear, language changes or tab hiding. A load failure preserves confirmed text and reports a retry option. No database, localStorage or sessionStorage is used. Reload resets custom phrases, settings and conversation state.

Where experimental browser model-context APIs exist, the app attempts to register `stage_careswitch_message`. It can select a valid card into a draft only; it cannot confirm, speak, enable the camera or contact anyone. It is optional and the normal app does not depend on that API.

See [verification](verification.md) for evidence, [privacy](privacy-and-safety.md) for data boundaries and [notices](third-party-notices.md) for bundled dependencies. Future changes could improve helper-assisted setup, full localization and input options after intended-user feedback; they are not implemented features.
