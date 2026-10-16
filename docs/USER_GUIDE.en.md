**English** | [简体中文](USER_GUIDE.md) | [Home](../README.md)

# User guide

## 🌐 [Open the web app](https://op16-field-sequencer.breezysquid.chatgpt.site/)

The interface is currently in Chinese. Chinese labels below identify the controls in the app; English text explains their meaning.

1. Click **播放 (Play)** to enable audio. Space starts or stops playback, except while you are typing in a text field.
2. The default boss-battle demo has 24 bars, displayed four bars per page. Use the left/right arrows to change pages. The view follows playback by default; manual selection lets you stay on a bar to edit it.
3. **M** mutes a part; **S** solos it. The sixth part is an independent countermelody in the boss-battle demo and can play triads in other presets.

## Edit notes

Click a step to toggle and select its note; right-click to select it without toggling. Use the controls below to adjust velocity, pitch and duration. One step is a sixteenth note, four steps make one beat, and the maximum note length is 32 steps.

Selecting bass, lead or the sixth part displays the piano roll. Click an empty area to add a note. Drag to change pitch or position, drag the right edge to change duration, and use right-click, Delete or Backspace to delete. In standard triad mode, all three chord tones move together.

Copy and paste operate on all six parts of the current bar. Clear disables the notes in the current bar only. Ctrl+Z undoes and Ctrl+Y redoes; up to 80 states are retained.

## Key, scale and sounds

Changing the root or scale also transposes the existing melody. With scale constraints enabled, new input snaps to the current scale. The boss-battle score includes chromatic passing notes; leave constraints off to preserve it.

Adjust the sound selection and level of each part, plus tempo, swing, filter and master volume. The boss-battle demo uses square and triangle waves. Other presets also use electric piano, plucked sounds, softer synth sounds and pads.

Melody generation replaces the lead across the entire current phrase. Melody variation changes some pitches; rhythm variation changes a small number of steps. Select the original preset again to restore its demo.

## The 3D instrument

Drag to rotate and scroll to zoom. Controls also provide a top view, automatic rotation, layer separation, enclosure transparency and color options. Click the physical-looking keys to audition notes, or drag the device knobs to adjust sound parameters.

Choose the part and octave used by the 3D keyboard to audition notes and see playback feedback for that part. Notes outside the visible key range still play. The display curve is a visual indication of the beat.

## Save and export

Autosave belongs to the current browser. Regularly click **保存工程 (Save Project)** to download an `.op16.json` file. **打开工程 (Open Project)** reads v1, v2 and v3 project formats, preserving the original notes in older projects.

Blank-project WAV export supports 1–32 bars; classic arrangements support their full length, looping the current complete phrase as needed. Output is 44.1 kHz, 16-bit stereo, with an additional 1.8-second audio tail. The default 24-bar boss-battle export lasts about 40.2 seconds. Audio rendering takes time; the browser downloads the file when it is ready.

Keep downloaded backups. The web app does not sync projects across devices or provide a cloud project library. Background playback and mobile behavior depend on the browser and operating system.


## Project length and classic library

Click **空白工程 (Blank Project)** below Play to create an empty four-bar project. Set **工程小节 (Project Bars)** or click **＋ 小节 (Add Bar)** to use 1–32 bars. Add Bar is disabled at 32. Shortening removes the final bars; Undo restores them. Resizing also sets the default export length. The complete classic arrangements contain 74, 44, 35, 48, 88 and 37 bars respectively, with full-length playback, editing and export. The default Shadow of the Ninja demo remains 24 bars. Untouched old excerpts upgrade automatically; edited excerpts remain intact with an explicit Load Full Arrangement action.

The piano roll preserves triplets and short notes within a step. Select, edit or delete each note individually.
