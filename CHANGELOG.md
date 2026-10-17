# Changelog / 更新记录

Version **2.2.2** · Web and local Windows synchronized **2026-10-17**. Historical excerpt notes below do not describe the current full library.

版本 **2.2.2** · 网站与本地Windows版于 **2026-10-17**同步。旧版本选段说明为历史记录，当前曲库已补齐完整编配。

## 2.2.2 — 2026-10-17 · Current / 当前

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
