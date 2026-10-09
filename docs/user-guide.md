# CareSwitch user guide

## Start without a camera

Open the [public demo](https://syedkaifali96.github.io/careswitch/) or serve `dist/` on localhost as described in the [README](../README.md). Click/tap a card, or use Tab to focus a control and Enter/Space to activate it. Selecting a card creates a **silent draft**. Review the words, then choose **Confirm message** or **Cancel**.

Confirm displays the chosen words and starts speech. Cancel removes the draft and preserves the previous confirmed message. Read again repeats the confirmed message; Clear removes it and stops playback. Draft selection itself does not start speech.

**Try without camera** additionally enables mouse-hold practice: hold the pointer over a target for the configured time. Touch uses direct taps. This mode performs no face tracking and is useful for understanding the interaction before camera setup.

## Set up head control

1. Sit comfortably. Keep the camera steady, one face visible, and enough light on the face. A helper can operate setup controls.
2. Click **Enable camera** and allow the browser's camera permission. The app loads its bundled model before asking for the camera.
3. Follow the five prompts: center, left, right, up, down. Use only comfortable voluntary movement. Each prompt takes about three seconds when tracking remains valid.
4. If only the preview appears and the status says “Set your movement range”, click **Set my movement range**. If setup is canceled or rejected, repeat it or use direct input.
5. When “Head control active” appears, move into empty board space, then guide the pointer onto a message and hold. The progress ring fills; the default hold is 1.5 seconds.
6. After a draft appears, move off all active targets. Then move onto **Confirm** or **Cancel** and hold again. This release prevents the first hold from immediately confirming a message.

The pointer controls targets inside the communication board. It does not control the whole computer, track eye gaze, type arbitrary text or make calls. A phrase asking for a caregiver is spoken to a nearby listener; someone must act on that request.

**Pause** stops message dwell. In active mode, the same button becomes Resume and can be reached with the pointer. **Turn camera off** releases the camera. Switching away from the tab also stops it; return and enable/calibrate again. Recalibrate after moving the camera or changing your seating position.

## Make movement comfortable

Open **Settings**. A helper can adjust these controls; setup and editing are not fully hands-free workflows.

| Control | Range / default | Use |
| --- | --- | --- |
| Hold time | 1–4 seconds; default 1.5 | Longer holds give more time to settle |
| Sensitivity | 0.6–1.6×; default 0.8× | Lower values soften small movements while retaining the calibrated edges |
| Smoothing | Light, Medium, Strong; default Strong | Strong is steadier and responds more slowly |
| Reverse left/right | Off by default | Use if the movement direction feels reversed |
| Voice | Automatic or Free built-in voice | Automatic prefers a matching local device voice |

Filtering reduces jitter but cannot eliminate all accidental selections or discomfort. Adjust one setting at a time. Stop if movement feels uncomfortable; direct input remains available.

## Languages, speech and custom phrases

The Message language selector provides **English, Urdu, Arabic, Hindi, Spanish, French, German and Chinese** packs. Chinese fallback speech is Mandarin. Urdu/Arabic message text is displayed right-to-left. Surrounding instructions and card hints remain English.

Automatic speech chooses a matching voice only when the browser marks it as local. Otherwise it uses the bundled free eSpeak NG engine. To test that engine directly, choose **Settings → Voice → Free built-in voice**. It sounds synthetic and pronunciation varies. For Arabic custom text, include vowel marks. Selecting another language is not automatic translation of your custom phrases.

Select **Customize messages**, edit the six phrases in the selected pack, then **Use these messages**. Every card needs nonempty text, up to 160 characters. The selected pack changes; other packs do not receive a translated copy. Phrases and settings live in memory and reset on reload. Avoid entering sensitive personal details when demonstrating publicly.

## Keyboard shortcuts

- Tab / Shift+Tab: move focus; Enter or Space activates a focused native button.
- Escape: cancel a draft when no dialog is open; dialogs use their normal cancel/close behavior.
- Space outside buttons, fields and dialogs: pause/resume active camera or practice mode.

## Troubleshooting

| What you see | What to try |
| --- | --- |
| Preview works but the pointer does not | Complete **Set my movement range**; preview alone is insufficient |
| Pointer is too fast or shaky | Keep the camera steady; select Strong smoothing and lower sensitivity; recalibrate |
| “Face not found”, multiple faces or delayed tracking | Improve light, show one face, close busy apps; dwell is stopped while tracking is invalid |
| Movement range rejected | Repeat comfortable, distinct positions with a steady camera; use direct input if reliable range is unavailable |
| Permission declined / camera unsupported | Allow permission in the browser or use practice; try a recent Chrome/Edge browser |
| Model loading times out | Check the connection and retry; direct card interaction still works |
| Non-English text appears but there is no sound | Select Free built-in voice, allow the initial download, then tap **Read again** to unlock audio |
| First speech load fails | The 18.5 MB WASM can take time; retry Read again after the connection settles |
| Camera stopped after switching tabs | Enable it again and recalibrate; this is intentional |
| Custom phrases disappear after reload | This version stores edits only in memory |

The confirmed text remains usable if sound is unavailable. Physical phones, fluent-speaker pronunciation and comfort for intended users still require testing; responsive browser previews alone do not establish those results.
