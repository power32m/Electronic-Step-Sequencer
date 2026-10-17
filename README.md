**English** | [简体中文](README.zh-CN.md)

<div align="center">

# OP·16 · Electronic Step Sequencer

**See your rhythm take shape.**

Three stacked keyboards · Six-part sequencing · Piano roll · FC/NES classics

## 🌐 [Play online — no installation or account needed](https://op16-field-sequencer.breezysquid.chatgpt.site/)

**[User guide](docs/USER_GUIDE.en.md) · [Product overview](docs/PRODUCT.en.md) · [Windows desktop](docs/WINDOWS.en.md) · [What's new](CHANGELOG.md)**

Created by **无痛穿耳** · Created **2026.10.15** · Version **2.2.4** · Updated **2026.10.18**

</div>

> Click **播放 (Play)** to hear a complete arrangement. Edit its notes or create a blank project with a styled accompaniment. Save editable JSON or export stereo WAV. **The app interface is in Chinese; this repository provides English and Chinese documentation.**

[![OP·16 animated preview](docs/images/op16-demo.gif)](https://github.com/power32m/Electronic-Step-Sequencer/releases/download/v2.2.1/OP16-demo-20s.mp4)

**[20-second demo with sound (MP4)](https://github.com/power32m/Electronic-Step-Sequencer/releases/download/v2.2.1/OP16-demo-20s.mp4)** · The animated preview is silent.

## What is OP·16?

OP·16 is a lightweight electronic instrument and step sequencer. Three keyboards show lead, countermelody/chords and bass together; a six-part grid and piano roll let you edit the music. Sounds and the 3D model are generated locally. Explore rhythm, learn how parts work together or experiment with chiptune sounds.

## Features

| Area | Current behavior |
| --- | --- |
| Three keyboards | Orange lead, green countermelody/chords, blue bass; simultaneous feedback, full-score pitch ranges and per-layer audition |
| Views | Default 2D locks rotation and zoom for precise clicks; 3D allows rotation, zoom and auto-rotation |
| Six parts | Kick, snare, hi-hat, bass, lead and countermelody/chords; 16 steps per bar, four-bar navigation, volume, mute and solo |
| Playback | Sticky player, pause/continue, bar jump, playback from the editing bar and rewind |
| Editing | Piano roll, pitch, velocity, duration, independently timed notes within a step, undo/redo and bar copy/paste |
| Composition | Root, scale constraints, chord degrees, local-rule melody generation and variations |
| Accompaniment | Pop, Rock, Funk, Electronic Dance, Hip-hop, Latin and FC Chiptune, plus Random Style; repeat for variations in blank projects |
| Audio | Dedicated voice Worker, reusable cached buffers, WAV export with progress and cancellation |
| Projects | Local autosave, JSON import/export, v1/v2/v3 compatibility; 4 MB import limit on web and updated Windows builds |

![Current six-part editor and piano roll](docs/images/composer-current.png)

## Classic library

Complete **six-part adaptations of the listed MIDI arrangements**, preserving their selected parts' timeline and existing repeats. These are synthesized performances, not original soundtrack recordings.

| In-app name | Game / piece | Bars | BPM |
| --- | --- | ---: | ---: |
| 赤影战士 | Shadow of the Ninja · Boss Battle | 24 | 150 |
| 恶魔城 | Castlevania · Vampire Killer | 48 | 127 |
| 超级马里奥 | Super Mario Bros. · Overworld | 37 | 105 |
| 赤色要塞 | Jackal | 34 | 80 |
| 魂斗罗 | Contra | 46 | 110 |
| 洛克人Ⅱ | Mega Man II · Wily Fortress | 113 | 180 |
| 忍者龙剑传 | Ninja Gaiden · Act IV Stage 2 | 84 | 150 |
| 塞尔达传说 | The Legend of Zelda · Overworld | 24 | 148 |
| 沙罗曼蛇 | Life Force / Salamander | 38 | 142 |
| 最终幻想6 | Final Fantasy VI · The Decisive Battle | 110 | 205 |
First launch defaults to the boss battle; later launches can restore autosave. Classics support full-length playback, editing and export. Blank projects begin with four bars and support 1–32 bars. See [sources and arrangement notes](docs/CLASSIC_LIBRARY.md).

## Start listening or composing

1. **Listen:** select a piece and click **播放 (Play)**. Click again to pause, then **继续 (Continue)** to resume. The player stays visible while scrolling.
2. **Edit:** choose a bar and part; toggle steps or edit notes in the piano roll. Bar tools sit below the four-bar navigation.
3. **Create:** click **空白工程 (Blank Project)** below Play, choose a style and click **随机伴奏 (Random Accompaniment)**. Add or generate your lead. Repeat for accompaniment variations; Undo restores the previous result.
4. **Keep your work:** save JSON or export WAV, which includes a 1.8-second tail. Long pieces take time to render.

## Web and Windows

| | Web app | Windows desktop |
| --- | --- | --- |
| Start | [Play online](https://op16-field-sequencer.breezysquid.chatgpt.site/) | [Download Windows x64](https://github.com/power32m/Electronic-Step-Sequencer/releases/tag/v2.2.2) · [Instructions](docs/WINDOWS.en.md) |
| Network | First load needs network; no complete offline cache/PWA | Packaged resources run offline; installed WebView2 Runtime required |
| Autosave | Current browser profile and site | Existing local `OP16/WebView` profile |
| Project transfer | Save/open JSON | Save/open JSON |

The website, source and local Windows build are now **2.2.4 (2026-10-18)**, including a gently smoothed, stabilized live audio oscilloscope, version-linked release dates and the preceding rendering cleanup. Playback, pause/resume, silence, track switching and key audition were checked in a real browser, alongside 44 automated checks.

The **published Windows ZIP remains v2.2.2** with the ten-song library; it predates the live oscilloscope. Build the current source for 2.2.4.

 **[Download the Windows x64 ZIP](https://github.com/power32m/Electronic-Step-Sequencer/releases/tag/v2.2.2)**, extract it and open `OP16电子步进音序器.exe`. The SHA-256 file is attached to the same release. Keep all files together when publishing a desktop build.

Autosave does not sync across browsers, devices, web and desktop. Download JSON backups before clearing browser data or replacing a project. Background playback depends on the OS/browser. A modern browser with WebGL2 is required for the instrument; desktop use is recommended for detailed editing.

General MIDI import/export, VST, audio recording, vocals and cloud project storage are not supported. Standard chord mode creates triads; OP·16 is not a full DAW or unrestricted polyphonic editor.

## Run and build the source

Use **Node.js 22.12 or later**:

```bash
npm ci
npm run dev
```

Checks and production build:

```bash
npm test
npm run build
npm run preview
```

Output is in `dist/`, suitable for static HTTPS hosting. Relative asset paths support subdirectories. The public demo is hosted independently, **not automatically through GitHub Pages**. See the [Windows guide](docs/WINDOWS.en.md) for WPF/WebView2 builds.

## Technology and files

Vanilla JavaScript, Vite, Three.js and Web Audio. `synth-worker.js` prepares voice buffers; the audio clock and ticker schedule playback. Windows uses .NET 8, WPF and WebView2.

```text
src/       UI, projects, classic scores, audio, three-layer instrument, piano roll
desktop/   Windows host source
docs/      Bilingual product, user and Windows guides; current screenshots
tests/     Score integrity, compatibility, accompaniment and keyboard checks
public/    Static assets
```

## Credits and feedback

Music and game rights remain with their owners. Source visibility does not grant commercial music rights. See [music sources](docs/CLASSIC_LIBRARY.md) and [third-party notices](THIRD-PARTY-NOTICES.md). No open-source license has been designated for the application's own code.

Report problems in [Issues](https://github.com/power32m/Electronic-Step-Sequencer/issues), including browser/OS, reproduction steps and the affected bar. Share personal projects only if you want them public.
