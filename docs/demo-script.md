# CareSwitch published video: timeline and English narration

This script matches the [published 2:57 presentation](https://youtu.be/PYqF6pDfuLU) and included MP4. Times come from its authored chapter metadata; encoding rounding can shift boundaries slightly. It is edited actual app imagery in mouse practice mode, with synthetic Microsoft Zira Desktop narration and burned-in English captions. Camera/head-control workflow is explained, not recorded live.

| Scene | Authored time | What is shown |
| --- | --- | --- |
| 1 | 00:00.000–00:19.406 | Your movement. Your message. — CareSwitch · AI × Healthcare |
| 2 | 00:19.406–00:39.322 | AI removes an input barrier — Camera-mode workflow · explanation |
| 3 | 00:39.322–00:53.699 | Start with six clear choices — Actual app captures · mouse practice mode |
| 4 | 00:53.699–01:09.821 | Selection creates a silent draft — Actual app captures · mouse practice mode |
| 5 | 01:09.821–01:27.438 | Confirm before it is spoken — Actual app captures · mouse practice mode |
| 6 | 01:27.438–01:48.349 | Eight message languages. Free speech. — Actual app capture · Urdu confirmation |
| 7 | 01:48.349–02:05.071 | Adjust the controls to the person — Actual app settings · edited capture |
| 8 | 02:05.071–02:21.772 | Support helpers and smaller screens — Responsive browser capture · not a physical phone trial |
| 9 | 02:21.772–02:41.578 | Useful support, with clear boundaries — Student prototype · honest limitations |
| 10 | 02:41.578–02:56.635 | Let the user choose what is said. — CareSwitch · DSH Hacks V2 |

## Exact narration

### 1. Your movement. Your message.

When speaking or using a touchscreen is difficult, a simple message can be hard to express. CareSwitch is a student communication prototype. This edited demonstration uses actual mouse-mode screen captures, with synthetic narration. Live head tracking is explained, not recorded here.

### 2. AI removes an input barrier

For someone who can comfortably move their head, a helper can enable the camera and follow five movement-range prompts. A pretrained MediaPipe model finds face landmarks on the device. Calibration maps movement into an in-app pointer. This is head control, not eye-gaze tracking.

### 3. Start with six clear choices

The board provides six editable messages for a care conversation, including yes, no, and I need a break. Camera control uses a timed hold; mouse, keyboard and touch offer alternatives.

### 4. Selection creates a silent draft

Selecting I need a break creates a draft. The exact phrase appears for review, and nothing is spoken yet. Confirm and Cancel are separate choices. In head mode, the pointer must leave the first target before confirming.

### 5. Confirm before it is spoken

After confirmation, the chosen message appears as the final message. If playback fails, the confirmed text remains visible. Read again lets the user retry. CareSwitch reads the user's choice, rather than generating medical advice.

### 6. Eight message languages. Free speech.

Prepared messages cover English, Urdu, Arabic, Hindi, Spanish, French, German and Chinese. A matching local device voice is used when available. A bundled free speech engine provides a fallback without a paid API. Pronunciation still needs fluent-speaker review.

### 7. Adjust the controls to the person

Hold time, sensitivity and smoothing can be adjusted. Filtering and a speed limit steady the pointer. Missing faces, multiple faces or stale tracking stop dwell selection. Users can also force the free built-in voice.

### 8. Support helpers and smaller screens

A helper can edit the phrases or use mouse and keyboard. The responsive layout also supports touch. Setup instructions are currently English. Physical-phone performance, comfort and accessibility still need testing with real users.

### 9. Useful support, with clear boundaries

Camera frames are not recorded or uploaded by the app. There is no patient database. The caregiver phrase speaks a request; it does not contact anyone. CareSwitch does not diagnose, prescribe or send emergency alerts. It has not been clinically validated.

### 10. Let the user choose what is said.

AI tools helped build the prototype. The next step is feedback from intended users and accessibility specialists. Try CareSwitch using the project link. Your movement. Your message.

This script is not evidence of real head-input footage or a clinical/intended-user trial. See [video notes](CareSwitch-demo-notes.md) and [verification](verification.md).
