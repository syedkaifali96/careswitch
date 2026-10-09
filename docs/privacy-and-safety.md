# Privacy, responsible AI and limitations

## Data flow

| Data | Current handling |
| --- | --- |
| Camera frames | Used locally in the browser/vision worker; not recorded or uploaded by application code |
| Nose coordinates and calibration | Browser memory, used for the in-app pointer; no patient record or identity match |
| Chosen/custom messages | Browser memory and visible text; not sent by the app to a speech or AI service |
| Speech | Browser-marked local device voice or bundled eSpeak NG/Web Audio |
| Customization and decoded speech cache | Memory only; reset by reload/tab closure, with no app database |
| Asset requests | Host receives normal requests for page/model/runtime files; hosting logs/policies are outside the app |
| MediaPipe telemetry | Bundled runtime contains active usage/performance logging to Google's `odml.pa.googleapis.com/v1/log`; it is not disabled in this package |

The app requests video, not microphone audio. It releases camera tracks on Turn camera off and tab hiding/page exit. Local processing does not mean a public host has no request logs, a shared screen is private, or a device is secure against unrelated software.

The first visit needs network access for assets. There is no service worker or guaranteed offline installation. Browser cache behavior is outside the app's control. No user face footage was included in the submission package or presentation.

**Dependency telemetry correction:** local inference is not a promise of zero outbound traffic. The bundled MediaPipe runtime initializes an active performance/usage logger. Google's [official privacy notice](https://github.com/google-ai-edge/mediapipe#privacy-notice) distinguishes on-device input processing from metrics sent to Google. This package has not disabled that logger or added a metrics-consent flow. That remains a privacy follow-up before wider use; do not describe the current app as making only asset requests. The source audit does not establish actual network-request success on any particular device. See [audit evidence](api-network-audit.md).

## User control

Messages are predetermined or edited by the user/helper. Selection creates a silent draft; only Confirm produces the new final message and speech. Cancel, Pause, camera-off and direct input are available. Tracking interruptions stop dwell, and failed speech leaves confirmed text readable. These design choices reduce unintended activation; they do not eliminate it or prove safety for every user.

Use only comfortable voluntary movements. The prototype is intended to be explored with a nearby helper where necessary. Initial setup, settings and phrase editing may require that helper; they are not wholly hands-free. Do not make essential communication depend solely on an unvalidated prototype.

## Healthcare boundaries

CareSwitch supports expressing preferences. It does not diagnose disease, recommend/prescribe treatment, infer pain/emotions, interpret clinical documents, replace clinicians or function as an emergency alert. “Please call my caregiver” reads a request to a nearby listener; no call, notification or contact is sent.

The project has not been clinically validated or tested with intended users. It does not claim a medical-device certification, clinical outcome, accessibility certification or universal device support. Camera performance, accidental activation, comfort/fatigue and pronunciation require consent-based evaluation.

## Language and AI boundaries

There are eight prepared message packs, not every-language coverage. Surrounding UI is English. Custom text is not automatically translated across packs. Voice quality is synthetic; Arabic needs vowel marks with the bundled engine and Chinese fallback is Mandarin. Fluent speakers have not validated all translations/pronunciations.

The face-landmark model is pretrained third-party AI. The app does not identify the person or use a medical/LLM model. Speech synthesis is rule-based. AI development assistance is disclosed in the README and project story; the participant must review the submitted work and declarations.

The [verification record](verification.md) separates tests from user reports and remaining uncertainty. Dependency licenses and source provenance are in [third-party notices](third-party-notices.md).
