**English** | [简体中文](WINDOWS.md) | [Home](../README.md)

# Windows desktop app

## Current status

Version 2.2.2 (2026-10-17) contains the ten selected examples and stable sticky player. Jackal has no silent lead-in. The 4 MB project-opening limit supports the 113-bar Mega Man II arrangement; retired examples remain importable as personal projects.

**[Download the Windows x64 release](https://github.com/power32m/Electronic-Step-Sequencer/releases/tag/v2.2.2)**, extract the ZIP and open `OP16电子步进音序器.exe`. Keep the folder together; use the attached SHA256 file to verify the download. The app is not code-signed; verify the source if Windows displays an unknown-publisher prompt.

You can also [play online](https://op16-field-sequencer.breezysquid.chatgpt.site/). The build steps below are for developers; users of the ZIP need no development tools.

The current source also includes the subsequent rendering cleanup: 101 retired PCB meshes and unused explosion/X-ray updates were removed, and idle top view avoids unnecessary redraws. This was installed and tested locally. The existing v2.2.2 download has the ten-song library but predates that cleanup; build the current source to include it. The hosted website was not redeployed for this maintenance.

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

The 2026-10-17 local maintenance build passed 42 automated checks, all ten examples, startup, JSON save/restore, complete 40.2-second boss-battle WAV export and background playback at normal and 125% display scaling. The installed formal copy was tested again and all 496 packaged files were verified against their hashes. Large-project restoration used the roughly 1.7 MB, 113-bar Mega Man II project.

Developers can run `OP16电子步进音序器.exe --smoke-test` in a temporary publish copy, adding `--smoke-125` for 125% scaling. It uses a separate profile, writes verification files in the app directory, then exits. Keep these separate from personal projects.

See the [user guide](USER_GUIDE.en.md) for musical controls.
