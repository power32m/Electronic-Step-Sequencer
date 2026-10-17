# Source maintenance review / 源码清理审核

## Local maintenance / 本地维护 2026-10-17 · v2.2.2

- Removed the retired internal PCB model (101 meshes), its two materials, explosion interpolation and X-ray material updates. The legacy JSON fields remain readable; the current interface and musical events are preserved.
  移除已下线的内部电路板模型（101个网格）、两种材质、拆解插值及透视材质更新；保留旧工程字段的读取兼容，现有界面和音乐事件不变。
- A top-down view with auto-rotation selected no longer renders continuously while idle. Actual playback and 3D auto-rotation still update normally.
  俯视状态选择自动旋转后，空闲时不再持续重绘；播放联动与3D自动旋转照常工作。
- All 42 automated checks and the production build pass. All ten library entries pass playback, project round trips, three-layer checks and responsive overflow checks at 1628, 1366, 700 and 390 px.
  42项自动检查和生产构建通过；10首曲目播放、工程往返、三层键盘及四种宽度的页面溢出检查通过。
- This maintenance is installed in the local formal Windows build and synchronized to repository source and bilingual documentation. Public website and GitHub release assets are not rebuilt by this pass. Earlier review details below are historical evidence for v2.2.1.
  此次维护已安装至本地Windows正式版，并同步仓库源码和中英文文档；网站及GitHub发布附件未重新构建。以下为v2.2.1的历史审核记录。

Reviewed on 2026-10-17, against v2.2.1. This maintenance pass preserves the current interface and musical behavior.

本次于2026-10-17审核v2.2.1源码，保留当前界面和音乐功能。

## Changes / 清理内容

- Removed 62 CSS selectors for retired appearance controls, component labels, the old project title area and obsolete control placements.
  删除已下线的外观控制、零件标记、旧工程标题区域及旧控件位置对应的62条样式选择器。
- Removed two unused imports, an unused HTML escaping helper, the old single-keyboard range helper, an unused local binding and an empty branch. Pointer events now share the existing hit-test helper.
  删除两个无用引用、未调用的HTML转义函数、旧单层键盘音域函数、无用局部变量和空分支，统一复用已有的点击检测函数。
- Removed five screenshots with no remaining repository references. Current documentation screenshots and the demo GIF remain.
  删除5张仓库内已无引用的旧截图，保留当前说明配图和演示GIF。
- Kept legacy project validation and migration, complete MIDI event data, notices and regression tests.
  保留旧工程校验与升级逻辑、完整MIDI事件数据、来源说明及回归测试。

## Validation / 验证

- All 35 automated tests pass, including complete-score round trips, legacy migrations, timed notes, independent manuals and accompaniment preservation.
  35项自动测试全部通过，覆盖完整曲谱往返、旧工程升级、音符时序、三层独立亮键和伴奏保护。
- Production build passes. Compiled CSS decreases from 40.09 kB to 35.96 kB. The existing bundle-size warning remains; this is not a claim that all performance work is complete.
  生产构建通过，构建CSS由40.09 kB降至35.96 kB；现有打包体积提醒仍保留，性能优化尚有空间。
- Browser checks at 1628, 1366, 700 and 390 px show identical measured layout before and after cleanup, with no page overflow. All seven presets, three manuals, styled accompaniment, play/pause and a non-silent WAV export pass without browser script errors.
  1628、1366、700和390像素宽度下，清理前后的布局测量一致，无页面横向溢出；7首曲库、三层键盘、风格伴奏、播放暂停及非静音WAV导出检查通过，无浏览器脚本错误。
- Local Markdown links and staged files are checked before publication. This is a focused source review and regression pass, not a comprehensive security certification.
  发布前检查本地文档链接和暂存文件。本次属于源码审查与回归验证，不代表全面安全认证。

## Release boundary / 发布范围

This source-only cleanup updates the default GitHub branch. The existing v2.2.1 Windows download and hosted website retain their tested builds. Git commit history remains available for earlier source revisions.

此次清理更新GitHub默认分支源码；现有v2.2.1 Windows下载及网站保留已经验证的构建。早期源码仍可从Git提交历史查阅。
