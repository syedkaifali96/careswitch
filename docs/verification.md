# CareSwitch prototype verification · 7 October 2026

## Verified

- JavaScript syntax checks passed for the application and vision worker.
- Calibration tests passed: neutral position, mirrored horizontal movement, vertical movement, inadequate movement range, and inadequate samples.
- Dwell tests passed: one activation while stationary, reset on a changed target, tracking interruption, and stale-frame gaps.
- The **actual bundled MediaPipe model** loaded in a browser Web Worker. The official public MediaPipe `portrait.jpg` sample produced **one face and 478 landmarks**. A blank image produced zero faces. A two-portrait composite produced two faces and no pointer position. This verification used no camera and is not a simulation of AI results.
- UI: selecting a card produced only a draft; confirmation displayed the selected message; cancel preserved the previous confirmed message.
- Practice mouse dwell selected a message. A separate dwell after moving into neutral space confirmed `I need a break.` The browser reported local speech completion on that run. An earlier playback attempt was blocked; the app displayed an honest fallback status.
- Urdu text and right-to-left confirmation displayed. The browser had no local Urdu voice, and the app showed text-only behavior.
- Custom messages updated the board. Desktop and 390-pixel mobile confirmation layouts were visually checked.
- A compact-layout issue that hid the camera button after practice was corrected and checked: Enable camera remains visible in compact practice mode.
- WebMCP tool registered with its schema and annotations. Valid staging returned `confirmed: false` and updated the visible draft. An invalid message ID was rejected without changing the draft or speaking.

## Still needs testing

- Live webcam permission, movement calibration and comfortable control on Kaif’s laptop; the agent did not open the user’s camera.
- Frame rate and stability on the actual 8 GB laptop under different lighting and camera positions.
- Intended-user feedback, accidental selections, fatigue, movement limitations, translation accuracy, and voice availability across devices.
- Real healthcare deployment, clinical safety and effectiveness have not been established. The demo is not an emergency alert, diagnosis tool, or clinically validated assistive device.

The public sample photo is used only in the local test harness and is excluded from the deployed app and source ZIP.

## Camera startup fix

Reproduced a browser startup case where camera video was playing with `readyState: 4`, but the `play()` promise remained pending. The previous app did not open calibration in this case. The fix checks usable frames with timeout/cancellation instead of waiting for that promise.

Verified with a local canvas video stream of the public sample photo and the actual bundled face model: startup opened calibration, all five movement steps completed, the app reported `One face tracked · head control ready.`, and the yellow pointer became visible. Tests also passed for delayed frames, no-frame timeout, canceled startup and rejected playback. This is a synthetic camera stream test, not a live webcam test on the user’s laptop.

## Pointer stability update

After the user confirmed live head control worked but was too fast/jittery, added three-sample median filtering, an 8-pixel deadband, smoothing on display frames, and a 480-pixel/second speed limit. Defaults are now 0.8× sensitivity and Strong smoothing. Sensitivity softens smaller movements but preserves the full calibrated edge reach.

Deterministic tests passed for small stationary noise, isolated spikes, per-frame speed limits, intentional movement, long frame gaps, tracking reset, invalid input, 30/60 Hz response consistency, and reach to all calibrated edges at low sensitivity. Existing dwell, calibration and camera-startup tests passed. The actual face model still completed calibration and displayed the pointer with the local sample video; the settings interface displayed the new defaults. The user still needs to assess stability and comfort with their own live head movements.

## Responsive UI verification

Checked the redesigned board at desktop 1440×900, tablet 768×1024, phone 390×844, small phone 320×568, and landscape 844×390. No horizontal page overflow in these checks. Settings fit the small-phone viewport and scroll internally. English selection/confirmation/cancellation, local speech fallback, Urdu right-to-left draft text, and keyboard focus transfer/return were verified.

With the actual bundled face model and a local sample-video stream, calibration completed in the phone layout. All six default English cards fit in the 320×568 viewport after compact-layout adjustments; confirm/cancel targets were reachable in both phone and landscape layouts. Recalibration and camera-off controls stayed available. Live physical phone camera permissions/performance, long custom messages across all writing systems, and intended-user usability still need testing. No user camera was opened by the agent.

Core calibration/dwell, pointer stability, camera-startup regression checks, and JavaScript syntax checks passed. Screenshots of the new desktop and mobile layouts are saved alongside this verification note. The local sample-video harness is excluded from deployment and the code ZIP.

## Free speech verification

Verified pinned espeak-ng 1.0.2 npm tarball integrity. The actual engine generated non-silent PCM WAV for English, Urdu, Arabic, Hindi, Spanish, French, German and Mandarin. The real browser worker/Web Audio pipeline reached playback completion for each of the eight language choices with Free built-in voice selected, and for a custom Urdu message. This verifies audio generation and playback completion, not a fluent-speaker pronunciation assessment or audibility on every user's physical device.

Meaningful speech-controller tests passed for local-only native voice selection, canceled/stale synthesis suppression, stopping current audio, stale native callbacks, explicitly choosing the free voice, worker failures, and audio-permission fallback. The speech worker maps Chinese to cmn, handles plain text via a local virtual input file, and rejects unsupported languages/overlong requests. No private text was sent to a speech service. Arabic defaults now include vowel marks to match the engine's documented input requirements.

Still needs user listening checks for pronunciation/comfort and hands-free audio on the user's own laptop/phone. First built-in use downloads approximately 18.7 MB of speech runtime assets. Failed or blocked audio retains confirmed text and suggests Read again. Existing face tracking remains the on-device AI component; built-in speech is rule-based.
