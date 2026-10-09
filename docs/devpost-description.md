# CareSwitch

**Tagline:** Your movement. Your message. A private, head-controlled communication board with free multilingual speech.

## Inspiration

A person may know exactly what they want to say but find speaking or using a touchscreen difficult. In a care conversation, even "Yes", "Please explain that again", or "I need a break" can help someone express a preference. CareSwitch explores a low-cost way to select those messages using voluntary head movement and an ordinary webcam.

The intended users are people who have difficulty speaking or using their hands, but can comfortably and voluntarily move their head, together with helpers who can assist with setup. This is a student prototype; it has not been tested with intended users or validated for clinical use.

## What it does

CareSwitch is an interactive communication board that runs in the browser. The user enables the camera, sets a comfortable movement range, and guides an in-app pointer to one of six editable messages. Holding on a card creates a draft. A separate Confirm or Cancel step keeps the user's choice explicit. Only a confirmed message appears as the final message and is spoken.

Prepared message packs cover English, Urdu, Arabic, Hindi, Spanish, French, German, and Chinese. The app tries a matching local device voice first, then offers a bundled, free eSpeak NG voice. A Free built-in voice setting lets users select that fallback directly. Confirmed text remains visible if sound is blocked. Read again retries playback. The interface supports mouse, keyboard and touch as well as camera input, and adapts to small screens.

"Please call my caregiver" is a message for a nearby listener. CareSwitch does not place calls or send alerts.

## How we built it

The app uses HTML, CSS and JavaScript modules with no server application or paid API. MediaPipe Face Landmarker detects facial landmarks inside a local Web Worker. A five-step calibration maps the nose landmark's position into the communication board's pointer range. This is head control, not eye-gaze tracking or face identification.

Median filtering, a deadband, smoothing and a speed limit make the pointer easier to hold. Dwell selection pauses when the face is missing, multiple faces appear, tracking becomes stale, a dialog opens, or the tab is hidden. A deliberate release separates card selection from confirmation. These controls reduce accidental activation but do not establish clinical safety.

Free speech uses a separate worker and bundled WebAssembly eSpeak NG runtime. It synthesizes text on the device, with no text sent to a speech service. eSpeak NG is rule-based speech synthesis; the AI component is the pretrained face-landmark model. Third-party licenses and source references are included in the code package.

AI assistance was used for ideation, coding, debugging, UI refinement, testing and documentation. The solo student participant is responsible for reviewing the work and presenting its limitations accurately.

## Challenges we ran into

Camera preview could start while the browser's video playback promise stayed pending. We changed startup to wait for usable frames with a timeout. Early pointer movement was too fast and jittery, so we added filtering and bounded motion. Device speech initially worked only for installed languages; the bundled speech engine made all eight message languages available without a paid API. On short phone screens, we compacted active camera controls and made settings scroll within the screen.

## Accomplishments that we're proud of

- A working interaction from head movement to draft, separate confirmation and spoken message.
- On-device face processing and speech, with no app database, camera recording or uploaded camera frames.
- Eight prepared message languages, editable phrases, right-to-left message display and free speech fallback.
- Responsive communication controls with touch and keyboard alternatives.
- Tests for calibration, dwell, pointer filtering, camera startup and cancellation of stale speech.

## What we learned

Useful AI can remove an input barrier without generating medical advice. A small number of predictable, editable phrases can be easier to review than open-ended generated messages. Calibration, readable targets, explicit confirmation and honest failure states matter as much as the model. Multilingual audio generation alone does not prove good pronunciation or usability.

## What's next for CareSwitch

The next step is consent-based feedback from intended users and accessibility specialists: comfortable movement, fatigue, accidental selections, setup assistance, and pronunciation. Future work could include fully translated setup instructions, additional message layouts and alternative input methods. Current limits include an English setup interface, only eight prepared message packs, synthetic voice quality, and unverified performance on physical phones. Arabic custom phrases need vowel marks for the bundled engine. No clinical outcome or universal device support is claimed.

CareSwitch supports communication. It does not diagnose, prescribe, infer pain or emotions, replace a clinician, or function as an emergency alert.

## Built with

HTML5, CSS3, JavaScript, Web Workers, WebAssembly, MediaPipe Face Landmarker, eSpeak NG, Web Audio API, SpeechSynthesis, GitHub.

## Links for the form

- Source: https://github.com/syedkaifali96/careswitch
- Existing hosted prototype: https://careswitch-demo.syedkaifali96.chatgpt.site/
- Hosted prototype currently requires owner sign-in. Do not use it as the sole judge demo link until access is changed or an open deployment is verified.
- Video URL: add only after a demo video is uploaded and its viewer access is checked.

Only the narrative sections above belong in the public project story; the form notes are preparation notes.
