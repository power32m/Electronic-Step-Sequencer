**English** | [简体中文](WINDOWS.md) | [Home](../README.md)

# Windows desktop app

## Current status

The local Windows distribution synchronized with the website on 2026-10-16: complete classics, three keyboards, fixed top view, playback navigation, voice Worker and current layout. Its version remains 2.2.1. The project-opening limit increased from 1 MB to 4 MB so the complete 88-bar River City Ransom project can reopen.

This repository provides desktop host source, **without a downloadable EXE release at present**. [Play online](https://op16-field-sequencer.breezysquid.chatgpt.site/) immediately or build it below.

## Build and start

Use 64-bit Windows, Node.js 22.12 or later, the .NET 8 SDK and Microsoft Edge WebView2 Runtime. From the repository root:

```powershell
npm ci
npm test
npm run build
dotnet publish desktop/OP16.Desktop.csproj -c Release -r win-x64 --self-contained true -o release
```

Open `release/OP16电子步进音序器.exe`. Keep the entire `release` directory together; the EXE alone is insufficient. Self-contained output includes the .NET runtime. End users need no Node.js, SDK or local server, but must have WebView2 Runtime installed.

## Offline operation, storage and upgrades

Resources load from packaged `wwwroot` through the local `https://op16.local/` mapping. Playback and export need no network. The website, by contrast, needs network for first load.

The normal WebView2 profile is `%LOCALAPPDATA%/OP16/WebView`. Preserve it during upgrades for autosave; do not overwrite it with an older profile. Website browsers and the desktop host have separate storage. Transfer work using Save/Open JSON files.

The app reads v1/v2/v3 projects up to 4 MB. Project saving and WAV export use native save dialogs. Playback can continue minimized while 3D rendering pauses; sleep, device changes and background policies may still affect audio.

To update, save JSON and exit the old app, back up its whole program folder, then replace it with the complete new publish directory. Preserve the user profile above; start the app and check project, sound and export.

## Desktop checks completed

The 2026-10-16 local distribution passed startup, JSON save/restore, complete 40.2-second boss-battle WAV export and background playback at normal and 125% display scaling. Large-project restoration used the roughly 1.2 MB, 88-bar River City Ransom project.

Developers can run `OP16电子步进音序器.exe --smoke-test` in a temporary publish copy, adding `--smoke-125` for 125% scaling. It uses a separate profile, writes verification files in the app directory, then exits. Keep these separate from personal projects.

See the [user guide](USER_GUIDE.en.md) for musical controls.
