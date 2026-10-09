# Third-party components and source provenance

The assets below are bundled locally. Their original files and licenses are preserved. This inventory identifies components; it does not certify legal compliance or establish a new license for the whole project.

## MediaPipe

- Runtime: `@mediapipe/tasks-vision` **1.1.0**, acquired from the official npm registry. Copyright Google / MediaPipe contributors; Apache-2.0. Included [license](../dist/assets/mediapipe/LICENSE).
- Model: Face Landmarker **float16 version 1**, bundled as `dist/assets/face_landmarker.task`. [Official model artifact](https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task).
- Model SHA-256: `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`.
- [Official JavaScript guide](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js) and [MediaPipe source](https://github.com/google-ai-edge/mediapipe).

The runtime JavaScript and several WebAssembly loader variants are retained under `dist/assets/mediapipe/`. The application uses Face Landmarker only; bundling the larger upstream runtime does not mean all its other tasks are used. No model training or modification is claimed.

## eSpeak NG

- npm distribution: **espeak-ng 1.0.2**, unmodified runtime JavaScript and WASM, copyright eSpeak NG contributors and Ian Armour; GPL-3.0-or-later.
- Included [license](../dist/assets/speech/LICENSE), [source/provenance record](../dist/assets/speech/SOURCE.txt) and [upstream build instructions](../dist/assets/speech/upstream-build.md).
- [Pinned package-source revision](https://github.com/ianmarmour/espeak-ng.js/tree/eec88dbcc1482b1a03a76cf9d2025a0acde8982e), [pinned npm tarball](https://registry.npmjs.org/espeak-ng/-/espeak-ng-1.0.2.tgz), [engine source](https://github.com/espeak-ng/espeak-ng).
- Recorded npm SHA-512 integrity: `Xe4YC7d/+O06zYpsqrJ3LpbETdL/IO8JrnAmWcQEMoRFmMLWU+2y2HnpEkOCnqZfb40MBDVyP4ppfusKdWbPcQ==`.

The npm package source is pinned, but its exact underlying C-engine commit was not recorded by the upstream package. Do not describe the bundle as having a fully established reproducible build or a verified exact source-to-binary mapping. Review the upstream licensing/source obligations before further redistribution. CareSwitch adapters are `dist/speech.mjs` and `dist/speech-worker.mjs`.

This engine synthesizes formant speech, not a neural/cloned voice. Arabic custom phrases need vowel marks; Mandarin uses voice `cmn`.

## First-party material and presentation

The first-party HTML/CSS/JavaScript, tests, project text and UI were prepared for this student project with AI assistance. No blanket first-party open-source license has been selected. Do not infer MIT/Apache licensing for the entire app from a dependency's license.

Presentation narration uses the installed Microsoft Zira Desktop voice locally; the OS voice software is not bundled as an app dependency. No participant webcam footage is published. Public sample-image streams were used only in local browser tests and are excluded from the deployed app and ZIP.

`FILE-MANIFEST.json` records payload hashes and sizes for this review ZIP, excluding the manifest itself. It verifies included bytes, not licensing or all possible security properties.
