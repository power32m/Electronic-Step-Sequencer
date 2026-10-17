**English** | [简体中文](USER_GUIDE.md) | [Home](../README.md)

# OP·16 user guide

## 🌐 [Open the web app](https://op16-field-sequencer.breezysquid.chatgpt.site/)

Version 2.2.4, updated 2026-10-18. The interface is Chinese; labels below identify the controls. See the [Windows guide](WINDOWS.en.md) for builds, offline use and storage.

For version and delivery details, see the [changelog](../CHANGELOG.md) and [Windows build status](WINDOWS.en.md). Autosaves and personal projects are preserved by the local maintenance; JSON backups remain the way to transfer work between web and desktop.

## 1. Playback and navigation

First launch defaults to **赤影战士 (Shadow of the Ninja · Boss Battle)**; later launches can restore autosave. Select a piece and click **播放 (Play)**, click again to pause, then **继续 (Continue)** to resume. Pause preserves the audio clock and held-note state.

| Control | Behavior |
| --- | --- |
| 小节 — bar input | Enter a bar number and press Enter; running playback continues there, otherwise press Play after positioning |
| 从第N小节播放 — play from bar N | Restart at the beginning of the current editing bar |
| 回到开头 — rewind | Stop and return to bar 1 |
| Four-bar navigation | Arrows change groups; click a card to select the editing bar |
| 跟随播放 — follow | On by default; manual bar/note selection stops following, checking it again restores it |

The player compacts and stays at the top while scrolling. Space plays/pauses, except while typing in text or numeric inputs.

## 2. Three keyboards and views

![Three keyboards and their color legend](images/instrument-current.png)

| Layer | Part | Color |
| --- | --- | --- |
| Upper | Lead | Orange |
| Middle | Independent countermelody or triad chords | Green |
| Lower | Bass | Blue |

All three respond together, each covering its full score range automatically. Chords illuminate all component notes. Click a key to audition that layer's sound. Muted tracks and tracks excluded by another solo do not illuminate. The display traces the actual synthesized output after filtering and master volume, updating at up to 30 frames per second. Pause freezes the trace; resume continues it; stopping or silence returns it to a flat line. Key audition also drives the display. Light visual smoothing and stable waveform alignment reduce jumping without changing the audio. The header shows the installed version and its release date, rather than the date you opened the app.

**俯视2D (Top View)** defaults to locked rotation and zoom. **立体3D (3D View)** allows drag rotation, scroll zoom and auto-rotation. **↺** restores fixed top view. Drag the model's sound knobs to change parameters. The legend below the instrument matches the track colors.

## 3. Classics and blank projects

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
All support full-length playback, editing and export; see [sources](CLASSIC_LIBRARY.md). Selecting a preset replaces the workspace, with Undo available. Save important edits first.

**空白工程 (Blank Project)** below Play starts an empty four-bar project. Set **工程小节 (Project Bars)** or use **＋ 小节 (Add Bar)** for 1–32 bars. Shortening removes trailing bars; Undo restores them. Resizing also updates the default export length. Complete classics retain their full lengths beyond the blank-project limit.

Untouched old 32-bar excerpts upgrade automatically. Edited excerpts remain intact, with **载入完整版 (Load Full Arrangement)** available for explicit replacement.

## 4. Accompaniment, melody and key

In blank projects, choose Pop, Rock, Funk, Electronic Dance, Hip-hop, Latin, FC Chiptune or Random Style, then click **随机伴奏 (Random Accompaniment)**. It generates drums, bass and chords across the project, preserving lead, chord progression, tempo and mixer. Repeat for variations; Undo restores the previous result. This is disabled for classics. FC Chiptune uses triangle bass and pulse chords.

**生成旋律 (Generate Melody)** replaces the project's lead, preserving other tracks. **旋律变奏 (Melody Variation)** changes some pitches; **节奏变奏 (Rhythm Variation)** changes a few steps. These use local rules, without an AI music service.

Root/scale changes transpose existing notes. Scale constraints snap new input to the selected scale; leave them off to preserve the boss battle's chromatic notes. In triad mode, bar chord-degree changes update chords and bass; independent countermelody mode hides these selectors.

## 5. Six tracks and note editing

![Current tracks and piano roll](images/composer-current.png)

The parts are kick, snare, hi-hat, bass, lead and countermelody/chords, with 16 steps per bar. **M** mutes, **S** solos; mute takes priority. Sound, volume and M/S controls align by column. Upper knobs control tempo, swing, filter and master level.

Click a step to toggle and select it; right-click selects without toggling. Edit velocity, pitch/root and duration below. One step is a sixteenth note, four steps equal a beat, and duration is at most 32 steps.

Select bass, lead or the sixth track to use the piano roll:

- Click empty space to add; drag notes to change pitch or start time.
- Drag the right edge for length; right-click, Delete or Backspace removes a note.
- Triplets and short notes within a step can be edited independently.
- Triad chord tones move together; arbitrary internal chord-tone editing is not supported.

Copy, Paste, Clear and Rhythm Variation are below four-bar navigation. Copy/Paste affect all six parts of the current bar; Clear disables only that bar's notes. Ctrl+Z undoes and Ctrl+Y redoes, with up to 80 history states.

## 6. Save, open and transfer

**保存工程 (Save Project)** downloads `.op16.json`; **打开工程 (Open Project)** reads v1/v2/v3. Web and updated Windows builds accept up to 4 MB, including the roughly 1.7 MB, 113-bar Mega Man II project.

Autosave belongs to the current browser or desktop profile. It does not sync between devices, browsers, web and desktop. Transfer via saved JSON; also back up before clearing browser data. **恢复旧版工程 (Restore Old Project)** reads old v1/v2 autosaves, replacing the workspace with Undo available.

## 7. WAV export

Choose a length and click **导出音频 (Export Audio)**. Classics support full length; blank projects support up to 32 bars. Export loops the current phrase as needed, writing 44.1 kHz, 16-bit stereo plus a 1.8-second tail. The default boss-battle export lasts 40.2 seconds.

Progress shows voice preparation, stereo rendering and WAV encoding. Long pieces take time. **取消 (Cancel)** discards this export while keeping the project. Native browser rendering may continue to completion, but the cancelled result will not download. A snapshot is taken at the click; later edits do not change that export.

Web downloads use the browser; Windows opens a save dialog. Desktop playback can continue minimized while 3D rendering pauses. Sleep, device changes and background policies may affect audio.

## Common questions

- **No sound:** click Play, check master/track M/S and system output, then try pause/continue or rewind.
- **Accompaniment disabled:** create a blank project; classics cannot use this operation.
- **Cannot rotate/zoom in 2D:** this is intentional for key clicks; switch to 3D.
- **Missing previous work:** use the same browser profile or desktop app; they do not share autosave.
- **Importing MIDI:** only built-in arrangements are supported; general MIDI import/export is unavailable.
