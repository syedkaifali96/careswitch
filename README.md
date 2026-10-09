# CareSwitch

A first hackathon prototype of a hands-free communication board. People who can voluntarily move their head can select a prepared message with a webcam-controlled **in-app** pointer. A separate confirmation step displays the message and attempts speech using a local device voice. It does not control the operating system, contact a caregiver, make an emergency call, diagnose, or infer pain/emotion.

## Try it

Use the hosted HTTPS demo in a recent Chrome or Edge browser, preferably full screen on a laptop. Camera access is off by default.

1. **Try with mouse / keyboard** demonstrates the board without camera access. Mouse dwell and click/Tab/Enter are supported. This mode is clearly labeled practice, not AI tracking.
2. **Enable camera** loads the on-device face model, then asks for browser permission. No microphone is requested.
3. Follow center / left / right / up / down setup prompts using only comfortable movements. Setup needs one visible face and a distinguishable movement range.

Camera startup checks usable video frames rather than waiting indefinitely for the browserâ€™s `play()` promise. If frames do not arrive within 10 seconds, it stops the camera and reports the problem. A non-responsive tracker also stops instead of silently hanging. The setup dialog explains missing faces, multiple faces, or delayed tracking directly.
4. Guide the pointer to a card and hold for 1.5 seconds by default. Move away from the card, then hold on **Confirm** or **Cancel**. A draft is never spoken.
5. **Pause head control** can be selected by dwell. Resume can also be selected by dwell. Settings adjust hold time, sensitivity, smoothing, and horizontal direction.
6. Stop the camera with **Turn camera off**. Hiding the tab also stops camera access; restarting requires another user action.

Head control now defaults to **0.8Ã— sensitivity** and **Strong smoothing**. Lower sensitivity softens small movements while retaining the full calibrated range, so edge controls remain reachable without exceeding the setup movements. Three-sample median filtering removes isolated landmark spikes, an 8-pixel deadband suppresses small drift, and display-frame interpolation limits pointer travel to 480 pixels/second. This trades some response speed for easier holding. Settings can adjust sensitivity and smoothing. Filtering resets when tracking is lost; stale frames still cannot select a message.

## Scope and boundaries

- Six editable messages; eight prepared message packs: English, Urdu, Arabic, Hindi, Spanish, French, German, Chinese. Other scripts can be entered manually. The surrounding setup interface is English in this first version; translations still need review by fluent speakers.
- Speech uses a matching **local** device voice when available, with a bundled free eSpeak NG voice as fallback for all eight message languages. Settings can force the free built-in voice. This is synthetic formant speech, not a natural neural voice. Arabic requires vowel marks; default Arabic phrases include them. If playback is blocked, confirmed text stays visible and Read again allows another attempt. No remote speech service is selected.
- MediaPipe detects face landmarks. Calibrated nose position maps to the board; it is head control, not gaze/eye tracking. Normal speech models and paid AI APIs are not used.
- Camera frames are processed in a local Web Worker and are not uploaded or recorded. Landmark results and customized phrases are held in memory in this tab. There is no application database, analytics, patient record, account system, or face recognition. The hosting provider necessarily receives ordinary page/asset requests.
- Dwell stops with no face, multiple faces, stale tracking results, an open dialog, or a hidden tab. A deliberate pointer release is required between draft selection and confirmation. These controls reduce accidental selection; they do not establish clinical safety.
- This has not been validated with intended users. Performance, comfortable movement range, accidental activations, lighting/occlusion, and language accuracy require real testing. Some people will need a helper for setup. It is not suitable when voluntary head movement is unavailable or uncomfortable.
- No claim of world-first novelty. Head-controlled assistive communication already exists. This prototype explores accessible browser setup, multilingual prepared messages, and explicit confirmation.

## Run locally

Serve `dist/` with a static web server on localhost; camera access requires localhost or HTTPS. For example, with Node.js installed:

```text
npx --yes http-server dist -p 4174
```

Open `http://localhost:4174`. Opening `index.html` directly as a file does not support workers/camera reliably. No build step, private key, API account, model training, or paid API is required. The free face model/runtime and speech engine are bundled under `dist/assets/` (about 63 MB before compression). The speech files load on first use of a built-in voice, not on initial page load.

## Third-party assets

- `@mediapipe/tasks-vision` **1.1.0**, from the official npm registry. Copyright Google / MediaPipe contributors, Apache-2.0. License is included at `dist/assets/mediapipe/LICENSE`.
- Face Landmarker model version **1**, official model URL: <https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task>.
- Model SHA-256: `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`.
- Guide: <https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js>.

AI assistance was used in planning, implementation, and debugging. The real AI component is the pretrained on-device face-landmark model. This is a prototype for evaluation, not a clinically validated assistive medical device.
## Responsive design update

The communication board now uses a clearer cobalt-and-white theme, consistent message icons, readable text, larger touch targets, distinct draft confirmation, and an understated empty state. On mobile, tap-based messages appear before camera setup. Camera setup and Back to messages links connect the two areas. Once head control is calibrated, camera controls become compact while recalibration and camera-off actions remain available. Short screens use a denser layout to keep the six messages reachable. Settings and message editing dialogs scroll inside the viewport. Keyboard focus moves to confirmation and returns to the selected card. Resizing clears pending dwell selection.

Mobile browsers need HTTPS, camera permission, and compatible camera/vision APIs. Chrome or Edge on a recent device is a recommended starting point. Responsive browser checks with a sample-video camera stream do not establish support or performance on every physical phone. Text messages work by touch without enabling the camera; speech can use local device voices or the bundled free engine.

## Free multilingual speech

The eSpeak NG npm distribution **1.0.2** is pinned, its SHA-512 integrity was verified against npm metadata, and its JS/WASM files are unmodified. It is GPL-3.0-or-later; its full license, source links and upstream build instructions are at `dist/assets/speech/`. The custom speech adapter is in `dist/speech.mjs` and `dist/speech-worker.mjs`. Existing MediaPipe attribution is retained.

Speech is synthesized in a separate local worker. Only the text language and message enter that worker; text is not put in a URL or sent to a server. The engine files are loaded from the same hosting origin. Mandarin maps to the cmn voice. Custom messages in the selected language are supported up to 160 characters. Pronunciation needs fluent-speaker review, particularly Urdu and Arabic; Arabic custom messages need full vowel marks. This does not provide automatic translation or guarantee every language/dialect.

A camera/practice click prepares local audio for later hands-free confirmation. Clear, language/voice changes and tab hiding stop playback. A canceled generation cannot speak a stale message when it finishes. Failures preserve confirmed text. Read again reuses cached audio (up to eight messages in memory). The built-in engine is a rule-based formant synthesizer; the AI component remains the face-landmark model.
