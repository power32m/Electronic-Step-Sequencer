# Classic library / 经典案例曲库

Updated 2026-10-17 · 当前菜单为10首，新增文件均由用户选定。

| 案例 / Example | 小节 / Bars | BPM | 音符事件 / Events |
| --- | ---: | ---: | ---: |
| 赤影战士 / Shadow of the Ninja · Boss Battle | 24 | 150 | 1598 |
| 恶魔城 / Castlevania · Vampire Killer | 48 | 127 | 1692 |
| 超级马里奥 / Super Mario Bros. · Overworld | 37 | 105 | 1279 |
| 赤色要塞 / Jackal | 34 | 80 | 1956 |
| 魂斗罗 / Contra | 46 | 110 | 3461 |
| 洛克人Ⅱ / Mega Man II · Wily Fortress | 113 | 180 | 6027 |
| 忍者龙剑传 / Ninja Gaiden · Act IV Stage 2 | 84 | 150 | 3874 |
| 塞尔达传说 / The Legend of Zelda · Overworld | 24 | 148 | 592 |
| 沙罗曼蛇 / Life Force / Salamander | 38 | 142 | 1421 |
| 最终幻想6 / Final Fantasy VI · The Decisive Battle | 110 | 205 | 4563 |

## Arrangement / 编配边界

Complete selected-part MIDI timelines, including source repeats and final notes, are retained. Redundant orchestral doubling and echo parts are omitted. Retained independent parts are merged into the three melodic tracks; percussion is split into kick/snare/hat. Identical events are deduplicated. Notes exceeding 32 steps are split at that limit. These are synthesized adaptations, not soundtrack recordings.

保留所选声部的完整时间线、原有重复段和尾段。重复音色及回声轨不重复叠加；独立声部合并到三个旋律轨，打击乐分到底鼓、军鼓及踩镲。完全相同的事件去重，超过32步的长音分段。这是程序合成改编，不是原声录音。

Jackal: all 1,956 events are retained. The 13.875-step silent intro (2.6015625 seconds at 80 BPM) is removed. Untouched old autosaves migrate; edited projects retain their timing. Retired Super C, Double Dragon II and River City Ransom are removed from the menu, but their saved personal projects remain importable.

赤色要塞保留1956个音符事件，去除开头13.875步、约2.6秒静音。未修改的旧自动保存可自动调整，编辑过的工程保留原时序。超级魂斗罗、双截龙Ⅱ、热血物语移出菜单，但旧个人工程仍可打开。

## Sources / 来源

[Boss arrangement / Herr Dethnout 2017](https://www.vgmusic.com/file/967564181be77d05ae63be4fe47ed6e8.html)。其余来源、文件SHA256、选用及省略轨道见 [audit JSON](classic-midi-audit.json)。桌面新选的6个文件以其校验值为准；未核实的转录作者不作推测。

Source track numbers below are zero-based. 新选文件的源轨号从0开始：

- 魂斗罗: selected [2, 3, 8, 1, 5]; omitted [4, 6, 7, 9]; 3461 events.
- 洛克人Ⅱ: selected [2, 6, 10, 1, 3, 4, 8, 9, 11, 12, 13]; omitted [5, 7]; 6027 events.
- 忍者龙剑传: selected [2, 7, 9, 10, 11, 3, 8, 4, 5, 6]; omitted []; 3874 events.
- 塞尔达传说: selected [1, 2, 3, 4]; omitted []; 592 events.
- 沙罗曼蛇: selected [4, 2, 6, 1]; omitted [3, 5, 7]; 1421 events.
- 最终幻想6: selected [1, 3, 13, 5, 6, 7, 8, 9, 11, 12, 10]; omitted [2, 4]; 4563 events.

Castlevania retains tracks 1/2/3/6 and omits echo 4/5; Super Mario retains 1/2/3/4; Jackal retains 1/2/3 and omits doubling 5/6/7.

Music and game rights remain with their owners. MIDI availability or source-code licensing does not grant music redistribution/commercial rights. 音乐与游戏权利归相应权利人；MIDI可取得及程序源码许可不改变音乐权利归属。

[English home](../README.md) · [中文首页](../README.zh-CN.md)
