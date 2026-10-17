# 2.3.1 — 2026-10-18

- Style-aware automatic harmonic loops, melody-weighted selection and recent-progression memory.
- Explicit inversions, block/split/arpeggiated harmony; editable and consistent across keyboard, piano roll and WAV.
- Manual chord degrees and legacy-project harmony remain protected. Loop endings retain rhythmic flow.

# Changelog / 更新记录

Version **2.3.0** · Web and local Windows synchronized **2026-10-18**. Public Windows download remains v2.2.2. Historical excerpt notes below do not describe the current full library.

版本 **2.3.0** · 网站与本地Windows版于 **2026-10-18**同步；公开Windows下载包仍为v2.2.2。旧版本选段说明为历史记录，当前曲库已补齐完整编配。

## 2.3.0 — 2026-10-18 · Current / 当前

- Replace the two-pattern accompaniment switch with local style grammars, two-bar motifs, four/eight-bar development, bass/kick coordination, phrase fills and a final cadence. FC uses chord-tone pulse arpeggios and triangle bass.
  两套固定伴奏升级为本地风格规则、两小节主题、四／八小节发展、贝斯与底鼓呼应、过门和收尾；FC采用脉冲波分解和弦与三角波贝斯。
- Consider existing lead attacks, held notes and timed events; reduce chord density/strength for busy leads. Rank six candidates for density, register movement, close clashes and similarity to the previous accompaniment.
  分析已有主旋律攻击点、长音和步内音符；密集旋律减少和弦密度及力度，每次比较六套候选的密度、音区跳跃、贴近音冲突和与上次的相似度。
- Preserve lead, harmony progression, tempo, key, scale and mixer; regeneration replaces drums, bass and countermelody/chords and supports Undo/Redo. Chord-degree editing preserves FC arpeggio intervals.
  保留主旋律、和弦进行、速度、调性及混音；重写鼓组、贝斯和副旋律／和弦，支持撤销重做；修改和弦级数保留FC分解和弦形态。
- Verify 51 automated checks, 70 distinct style arrangements, offline generation, playback, seven non-silent WAV renders and desktop generation. The composer uses local rules, not a trained neural model or remote API. See [details](docs/LOCAL_COMPOSER.md).
  验证51项自动检查、70套不同风格编排、断网生成、播放、七种非静音WAV及桌面生成。采用本地规则，不依赖训练模型或在线API，见[说明](docs/LOCAL_COMPOSER.md)。

## 2.2.5 — 2026-10-18

- Regroup the sound console into playback status, four evenly spaced sound controls and accompaniment generation. Align knob labels and numeric values, with a separate accompaniment row for narrower windows and stacked groups on phones. Existing musical controls are preserved.
  控制台重排为播放状态、四个等距声音控件和伴奏生成三组，统一旋钮文字及数值对齐；较窄窗口伴奏独立成行，手机纵向排列，保留原有音乐功能。
- Verify six viewport widths, group containment, knob/value alignment, tempo entry and keyboard control, playback/pause and styled accompaniment, alongside 44 automated checks and the production build.
  验证六种宽度、分组边界、旋钮／数值对齐、速度输入及键盘调节、播放暂停和风格伴奏，并通过44项自动检查和生产构建。

## 2.2.4 — 2026-10-18

- Add gentle display-only smoothing, fractional rising-crossing alignment and correlation with the preceding trace to reduce waveform jumping. A short 25 ms display response preserves musical dynamics; pause freezes and silence clears the trace. Audio synthesis and WAV output are unchanged.
  增加轻微显示平滑、精细过零定位和前后波形匹配，减轻跳动；约25毫秒的显示响应保留音乐动态，暂停冻结、静音清零，不改变音源或WAV输出。
- All 44 automated checks pass, including phase stability, amplitude changes, pulse-edge rounding, pause and clearing; real-browser checks cover playback, audition and responsive layouts.
  44项自动检查通过，新增相位稳定、强弱变化、边缘平滑、暂停与清零验证，并复查真实浏览器播放、试听和响应式界面。

## 2.2.3 — 2026-10-18

- Replace the decorative sine curve with live output samples after filtering and master volume. The trace follows playback and key audition, freezes on pause and returns to a flat line after stopping or silence. Sampling is capped at approximately 30 fps and skips offscreen instruments; WAV export keeps its existing signal path.
  示意正弦曲线改为读取滤波、主音量之后的实际输出，跟随播放和琴键试听，暂停冻结，停止／静音归为水平线；每秒最多约30次采样，乐器不在可视区域时跳过，WAV导出保持原音频路径。
- Header version and update date read package.json metadata (version/releaseDate). This release is 2.2.3 / 2026.10.18; future iterations update those fields together.
  页头版本和更新日期统一读取package.json中的version／releaseDate；本次为2.2.3／2026.10.18，后续发布同步更新这两个字段。
- Verify real-browser audio, silence, pause/resume, rewind, song switching, three-layer audition and four screen widths, in addition to 42 automated checks and the production build.
  除42项自动检查和生产构建外，验证真实浏览器音频、静音、暂停续播、回到开头、切歌、三层试听和四种屏幕宽度。

## 2.2.2 — 2026-10-17

### Maintenance / 维护更新

- Remove 101 retired internal PCB meshes, two unused materials and explosion/X-ray rendering updates; preserve legacy project compatibility. Avoid continuous idle redraws in fixed top view when auto-rotation is selected.
  移除101个废弃内部电路板网格、两种无用材质及拆解／透视渲染更新，保留旧工程兼容；固定俯视时选择自动旋转不再引起持续空闲重绘。
- Verify 42 automated checks, ten preset playback/round trips, three keyboard layers, four responsive widths, and normal/125% native checks including 113-bar restoration, 40.2-second WAV export and minimized playback. All 496 files in the installed local formal copy match the verified package.
  通过42项自动检查、10首曲目播放及工程往返、三层键盘、四种宽度和100%／125%桌面检查，覆盖113小节工程恢复、40.2秒WAV和最小化播放；本地正式版496个文件校验一致。
- Source and bilingual documentation include this maintenance. The local formal build is updated; existing v2.2.2 release assets and the hosted website retain the preceding ten-song build.
  当前源码及中英文文档包含本次维护，本地正式版已更新；已有v2.2.2下载附件和网站继续使用此前的10首曲目构建。

### Library / 曲库更新

- Keep and shorten names to 赤影战士, 恶魔城 and 超级马里奥; remove Super C, Double Dragon II and River City Ransom from the menu.
  保留并简化三个案例名称，移除超级魂斗罗、双截龙Ⅱ和热血物语菜单项。
- Remove Jackal's 2.6-second silent lead-in without removing notes; edited older projects remain intact.
  赤色要塞去除约2.6秒开头静音，保留音符及已编辑旧工程。
- Add six user-selected complete MIDI adaptations: Contra, Mega Man II, Ninja Gaiden, Zelda, Life Force and Final Fantasy VI. The library now has ten examples.
  新增用户所选6首完整案例，当前曲库共10首。

## 2.2.1 — 2026-10-16

### Source maintenance — 2026-10-17 / 源码维护

- Fix rapid sticky-player flicker near the scroll threshold by reserving the expanded toolbar's document space. Verified stable scrolling at five viewport widths, repeated threshold crossings, resizing and play/pause while sticky.
  修复吸顶播放栏在滚动临界区域剧烈抖动：保留展开工具栏的页面占位，避免高度变化引发反复切换。已验证5种宽度、反复跨越临界点、窗口调整与吸顶状态下播放暂停。

- Remove 62 obsolete CSS selectors, unused imports, an unused single-keyboard helper and five unreferenced screenshots; reuse the keyboard hit-test helper.
  删除62条失效样式选择器、无用引用、旧单层键盘辅助函数及5张无引用旧截图，复用琴键点击检测逻辑。
- Verified 35 tests, production build and four viewport layouts, plus all seven presets, three manuals, styled accompaniment, playback/pause and WAV export. Product behavior is unchanged; the published v2.2.1 binary remains available.
  已验证35项测试、生产构建和4种屏幕布局，以及7首曲库、三层键盘、风格伴奏、播放暂停与WAV导出。产品行为保持一致，已发布的v2.2.1安装包继续保留。

### Features / 功能

- Three stacked keyboards: simultaneous lead, countermelody/chords and bass, complete-score ranges, chord tones and per-layer audition.
  三层键盘同步显示主旋律、副旋律／和弦与贝斯，自动覆盖全曲音域，支持和弦多音和各层独立试听。
- Fixed 2D locks rotation and zoom; 3D retains camera controls. Instrument legend and aligned tracks share part colors.
  默认2D锁定旋转缩放；3D保留视角操作，图例与对齐轨道采用相同声部颜色。
- Sticky player, pause/continue, bar jump, playback from the editing bar and rewind; bar tools move beside navigation.
  吸顶播放、暂停续播、小节定位、当前小节播放与回到开头；小节工具移至分页旁。
- Voice Worker and reusable cache; WAV progress and cancellation.
  后台音源Worker、复用缓存、WAV导出进度与取消。
- Complete classic arrangements restored to 74/44/35/48 bars; River City Ransom (88) and Super Mario Bros. (37) added. Stage suffixes removed from names.
  四首曲目补齐74／44／35／48小节，新增热血物语88小节与超级马里奥37小节，移除曲名“第一关”。
- Blank projects offer seven accompaniment styles, preserving lead and supporting Undo.
  空白工程增加七种风格伴奏，保留主旋律，可撤销。
- Windows release synchronized; 4 MB project limit fixes reopening the complete River City Ransom project, preserving existing autosave storage.
  Windows正式版同步，4MB工程打开上限修复热血物语完整工程恢复，保留自动保存目录。
- Bilingual README, product, user and Windows guides refreshed with current screenshots.
  更新中英文首页、产品介绍、使用及Windows指南和当前界面配图。

## 2.2 — 2026-10-16 · Historical / 历史

Four 32-bar classic excerpts; Blank Project below Play; 1–32-bar blank projects and independently timed notes within steps.

四首32小节经典选段；空白工程移至播放下方，支持1–32小节，保留步内连奏和三连音。

## 2.1 — 2026-10-15

Shadow of the Ninja's 24-bar, 150 BPM boss battle, two melodies, pulse/triangle sounds, complete phrase looping, four-bar navigation and legacy-project compatibility. Author/date and public website added.

赤影战士Boss战24小节、150 BPM双旋律案例，方波／三角波、完整乐句循环、四小节分页与旧工程兼容；增加作者日期和公开网站。

## 2.0

Six-part, four-bar composition, piano roll, melody generation/variation, key and chord editing.

六声部四小节编排、钢琴卷帘、旋律生成／变奏、调性与和弦编辑。

## 1.0

Four tracks, 3D device, local saving and WAV export.

四轨步进音序器、3D设备、本地保存与WAV导出。
