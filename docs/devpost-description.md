# CareSwitch

**Your movement. Your message.** An on-device, head-controlled communication board with free multilingual speech.

## Inspiration

A person may know exactly what they want to say but find speaking or using a touchscreen difficult. During a care conversation, even “Yes”, “Please explain that again”, or “I need a break” can help express a preference. CareSwitch explores an ordinary-webcam input option for people who can comfortably and voluntarily move their head, together with helpers who can assist with setup.

Rather than asking a language model for healthcare advice, the project uses AI to make a communication board reachable. Existing assistive communication tools already exist; our contribution is this focused integration of comfortable calibration, deliberate confirmation and free local multilingual speech. Potential impact remains to be evaluated with intended users.

## What it does

The user enables the camera and follows five movement-range prompts. Their movement guides an in-app pointer over six editable messages. Holding over a card selects a silent draft. After leaving the target, the user holds over Confirm or Cancel. Only confirmation produces the final visible message and speech.

Prepared packs cover English, Urdu, Arabic, Hindi, Spanish, French, German and Chinese, with right-to-left message display for Urdu/Arabic. A matching local device voice is preferred; bundled eSpeak NG provides free fallback speech without a paid API. Read again retries audio, and confirmed text remains visible if playback fails. Mouse, keyboard and touch alternatives support helpers and practice. Responsive layouts adapt to small browser viewports.

“Please call my caregiver” reads a request to a nearby listener. It does not place a call or send an alert.

## How we built it

HTML, CSS and JavaScript modules run as a static browser app. A pretrained MediaPipe Face Landmarker runs in a local Web Worker. Five-position calibration maps nose-landmark coordinates into the board's pointer range. This is head control, not eye gaze or face identification.

Median filtering, an 8-pixel deadband, smoothing and a 480-pixel/second cap steady movement. Hold time, sensitivity and smoothing can be adjusted. Missing/multiple faces, stale tracking, dialogs and tab hiding stop dwell selection; hiding the tab also stops the camera. A separate release and confirmation step reduce unintended activation.

Speech uses a matching browser-marked local voice or a separate eSpeak NG WebAssembly worker and Web Audio. Text is synthesized on the device. eSpeak NG is rule-based; the AI component is the face-landmark model. There is no backend, patient database, participant-supplied paid API key or application upload of camera frames/messages. Hosts receive normal asset requests. The bundled MediaPipe runtime also has usage/performance telemetry to Google; this version does not claim zero external traffic.

AI tools assisted planning, coding, debugging, UI refinement, tests and documentation. Syed Kaif Ali is the solo student participant and must review and accurately present the work. Third-party licenses and source references are included.

## Challenges and accomplishments

Camera preview could play while its playback promise remained pending; startup now waits for usable frames with timeout/cancellation. An initially fast/jittery pointer led to filtering and bounded motion. Installed voices initially limited language support; bundled free synthesis added eight prepared language options. Compact layouts were adjusted to keep setup controls available and settings scrollable.

Four regression scripts cover calibration/dwell, pointer stability, camera startup and speech cancellation/failure paths. Actual bundled model and speech-engine browser checks supplement them. The creator reported head control working on their laptop. Responsive checks used browser viewports, not physical-phone trials, and audio completion does not prove pronunciation quality.

## What we learned and what's next

Useful healthcare AI can remove an input barrier without generating medical answers. Predictable phrases, reviewable drafts and explicit user control matter as much as the model.

Next steps are consent-based feedback from intended users and accessibility specialists, fluent-speaker review, physical-phone testing and fully translated setup instructions. Current limits include an English UI, eight prepared packs, synthetic pronunciation, Arabic vowel-mark requirements, helper-assisted setup and unverified comfort/fatigue. No intended-user or clinical trial has been performed.

CareSwitch does not diagnose, prescribe, infer pain/emotions, replace a clinician or act as an emergency system.

## About the presentation

The 2:57 video uses edited actual app screenshots in mouse practice mode, synthetic English narration and burned-in captions. The head-control workflow is explained, not recorded live. It is not a patient trial or a continuous recording of head selection.

## Built with

HTML5, CSS3, JavaScript, Web Workers, WebAssembly, MediaPipe Face Landmarker, eSpeak NG, Web Audio, SpeechSynthesis and GitHub Pages.

## Project resources

- [Interactive demo](https://syedkaifali96.github.io/careswitch/)
- [Source repository](https://github.com/syedkaifali96/careswitch)
- [Presentation video](https://youtu.be/PYqF6pDfuLU)
- [One-page description](CareSwitch-project-description.pdf)
- [Reviewed code PDF](CareSwitch-code.pdf)

This is the finished English narrative for review. Updating this local document does not update the currently saved Devpost draft; submission state is recorded separately in the checklist.
