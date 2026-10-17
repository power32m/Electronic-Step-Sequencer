[English](#local-accompaniment-composer) · [简体中文](#本地伴奏编配)

# Local accompaniment composer

Available in source, the website and the local Windows build from **2.3.0**.
The published Windows ZIP remains v2.2.2. Build current source for this feature.

Choose a style and click **随机伴奏** in a blank project. No new controls, account,
API key, model download or composition server are needed. The generator runs in
JavaScript on the device; the web app still needs its resources loaded first.

The button replaces drums, bass and countermelody/chords throughout the 1–32-bar
project. Lead notes, the existing chord progression, key/scale, tempo, swing,
filter, master level and track volume/mute/solo remain intact. Bass/harmony
instrument and articulation are selected by style. Save important edits first;
Undo/Redo also covers generation.

## How an arrangement is built

1. **Style grammar:** mandatory drum anchors, optional syncopations, hat patterns,
   bass/chord rhythms, articulation and instrument choices define each family.
2. **Theme and development:** a two-bar idea repeats with variations. Four-bar
   boundaries may receive fills; longer projects develop energy over eight-bar
   sections, including a quieter section in 17–32-bar projects. The final bar
   leaves space and holds a stable chord tone, using the existing harmony.
3. **Coordination:** bass accents can reinforce kick hits. Chord roots stay in a
   nearby register. Dense written lead parts reduce chord attacks and strength;
   sparse lead parts permit more responses. Held and independently timed lead
   events are considered without editing the lead.
4. **Candidate selection:** six complete candidates are compared for density,
   bass jumps, coordination, close lead/harmony clashes and similarity to the
   preceding accompaniment. Candidates with empty parts or excessive percussion
   density are rejected. The random seed advances on every generation.

| Style | Main cues |
| --- | --- |
| Pop | Backbeat, balanced kick/bass, longer chord support |
| Rock | Backbeat, stronger drum/bass accents, picked chord sound |
| Funk | Syncopated attacks, short bass/chord gates, space |
| Electronic dance | Four-on-the-floor kick, offbeat hats, rhythmic chords |
| Hip-hop | Half-time snare, syncopated kick, sustained bass/pad |
| Latin | Syncopated percussion and anticipated bass/chord rhythms |
| FC chiptune | Triangle bass and single-note pulse chord arpeggios |

**Random Style** cycles through the seven families. Keeping an explicit style
varies the arrangement within it. Editing chord degrees preserves the interval
pattern and rhythm of generated FC arpeggios.

This is a rule-based local composer, **not a trained neural music model**. It
does not infer new chord progressions from recordings or guarantee a good result
for every melody. Style cues are simplified, tempo is not changed automatically,
and results remain editable. Current verification covers ten structurally
different generations per style, tonal/range boundaries, lead/mixer preservation,
melody-aware density, offline generation, Undo/Redo, playback and stereo WAV.

# 本地伴奏编配

从 **2.3.0** 起，源码、网站和本地Windows版采用新的本地编配器。
公开Windows下载包仍为v2.2.2，自行构建当前源码可获得本功能。

在空白工程中选风格、点击“随机伴奏”即可。无需增加控件，不需要账号、API、
模型下载或在线作曲服务。生成在本机完成；网页版仍需先加载程序资源。

按钮会重写整个1–32小节工程的鼓组、贝斯和副旋律／和弦，包括这些声部已有的
手工修改。主旋律、和弦进行、调性、速度、摇摆、滤波、主音量及各轨的音量／
静音／独奏保持不变；贝斯与和声的音色及演奏方式按风格选择。重要修改先保存，
生成也支持撤销、重做。

## 生成逻辑

1. **风格规则：** 以强拍、可选切分、踩镲、贝斯／和弦节奏、音长和音色约束风格。
2. **主题与发展：** 两小节主题反复并变化，四小节边界可出现过门；较长工程按
   八小节段落调整能量，17–32小节工程包含较安静的段落。最后一小节留白并保持
   当前和弦的稳定音，不改变你设定的和弦进行。
3. **声部配合：** 贝斯呼应底鼓，和弦音区尽量平稳。已有主旋律密集时减少和弦
   落点与力度，留白较多时允许更多回应；长音和步内独立音符也参与分析。
4. **候选筛选：** 每次生成六套完整候选，比较密度、贝斯跳跃、声部配合、与
   主旋律的贴近半音冲突，以及与上一次伴奏的相似程度，再选出一套。缺少声部
   或打击乐过密的候选会被排除，每次生成都会推进随机种子。

流行偏均衡支撑，摇滚强调鼓与贝斯，放克突出切分短音，电子舞曲保留四拍底鼓，
嘻哈采用半拍军鼓和较长铺底，拉丁采用切分与提前落点，FC使用三角波贝斯及
脉冲波分解和弦。“随机风格”轮换七种风格，固定风格则在该风格内部产生变化。
修改和弦级数时，FC分解和弦保留原节奏及音程形态。

这是**规则驱动的本地编曲器，不是训练好的神经音乐模型**。它不会从录音推断
新的和弦进行，也不能保证每条旋律都搭配得理想。风格属于简化近似，速度不会
自动改变，结果可继续编辑。已验证每种风格连续十次结构不同的编排、调性／音区
边界、主旋律与混音保护、旋律密度响应、断网生成、撤销重做、播放和立体声WAV。
