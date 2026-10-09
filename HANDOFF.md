# 「音乐时刻」Demo — AI 接力上下文文档

> **这份文档的目的**：让任何一个新接手的 AI（或人类）在**不读历史对话**的情况下，5 分钟内理解项目、继续迭代。
>
> 最后更新：2026-10-07
> 当前状态：**构建通过 ✅，等待视觉走查确认**

---

## 1. 项目一句话

一个**移动端 Web Demo**，模拟「QQ 音乐」里推出的新功能「**音乐时刻**」——
用户在听歌时可以为这首歌留一句话/emoji，未来再听时能"遇见过去的自己"。

**不是**：日记 App、评论、朋友圈、AI 总结、音乐社区。
**是**：绑定在**歌曲**上的个人记忆。

---

## 2. 技术栈 & 运行

| 项 | 值 |
|---|---|
| 路径 | `/Users/didi/dchat-workplace/music-moments/` |
| 框架 | React 18 + Vite 5 |
| 样式 | Tailwind CSS 3.4 + 自定义 CSS（`src/index.css`） |
| 图标 | `lucide-react` 0.454（部分图标是手写内联 SVG） |
| 数据 | `localStorage`，无后端 |
| 设计稿目标 | **390 × 844**（iPhone），兼容 375×812 / 430×932 |

### 命令

```bash
cd /Users/didi/dchat-workplace/music-moments
npm install     # 已装过，跳过
npm run dev     # 起 dev server（默认 http://localhost:5173）
npm run build   # 产物在 dist/，最近一次构建 0 错误 0 警告
```

### Node 环境

用户本机最初**没装 Node**，通过 `~/.SmartWork/skills/nodejs-install/scripts/install-node.sh` 装好。
当前 `node -v` / `npm -v` 可用。

---

## 3. 文件结构（当前真实状态）

```
music-moments/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js        # 自定义色板：ink/paper/card/line/cream/mute/amber.glow
├── postcss.config.js
├── public/
│   └── covers/               # ⚠️ 真实封面，禁止换成占位图
│       ├── sunny.jpg         # 《晴天》周杰伦
│       ├── meeting.jpg       # 《如果我们不曾相遇》五月天
│       └── longtime.jpg      # 《陪你度过漫长岁月》陈奕迅
└── src/
    ├── main.jsx
    ├── App.jsx               # 单页状态机，无 react-router
    ├── index.css             # 动画 keyframes + .vinyl-disc 黑胶质感
    ├── data/
    │   └── mockData.js       # SONGS（3 首）+ PRESET_MOMENTS（8 条）+ localStorage 读写
    └── components/
        ├── PlayerPage.jsx        # ⭐ 播放器主页（最近改动都在这）
        ├── MomentSheet.jsx       # 「留住此刻」Bottom Sheet
        ├── MomentSavedModal.jsx  # 保存后「遇见过去的自己」全屏
        ├── SongTimeline.jsx      # 单首歌的时刻时间线
        ├── MyMoments.jsx         # 全部时刻列表
        ├── ShareCard.jsx         # 分享卡片
        └── BottomNavigation.jsx  # （已不在主流程用，App 没引）
```

---

## 4. 数据模型（`src/data/mockData.js`）

```js
SONGS = [
  { id: 'sunny',    name: '晴天',           artist: '周杰伦', cover: '/covers/sunny.jpg',    duration: 269 },
  { id: 'meeting',  name: '如果我们不曾相遇', artist: '五月天', cover: '/covers/meeting.jpg',  duration: 202 },
  { id: 'longtime', name: '陪你度过漫长岁月', artist: '陈奕迅', cover: '/covers/longtime.jpg', duration: 242 },
]

Moment = {
  id: 'm-<timestamp>' | 'p1'..'p8',   // 预置 8 条用 p 前缀
  songId: 'sunny' | 'meeting' | 'longtime',
  text: string,
  emoji: '❤️' | '🌙' | '☀️' | '🥹' | '🎧' | '✨' | null,
  image: string | null,
  date: '2026.10.07',                  // 展示用
  createdAt: number,                   // 排序用
}

localStorage key = 'music-moments:v2'
```

**改字段前先全文搜索 `createdAt` `songId` `emoji`**，这三个字段在 PlayerPage / MomentSheet / MomentSavedModal / SongTimeline / MyMoments / ShareCard 都被消费。

---

## 5. 视图状态机（`App.jsx`）

```
view ∈ { 'player', 'timeline', 'all', 'share' }
       ↓                            ↑
   PlayerPage  ←─ onBack ── SongTimeline
       ↓                            ↓ onShare
   MomentSheet (modal)          ShareCard
       ↓ save
   MomentSavedModal (「遇见过去的自己」)
```

- **没有 react-router**，纯 `useState` 切 view。
- **没有底部 Tab 在主流程里**——产品上故意做成"播放器里的一个能力"，不是独立 App。
- 切歌通过 `prevSong` / `nextSong`，3 首循环。

---

## 6. 视觉基调（`tailwind.config.js`）

| token | 值 | 用途 |
|---|---|---|
| `ink` | `#191613` | 主文字 / 主按钮 |
| `paper` | `#f7f5f0` | 页面底（米白纸感） |
| `card` | `#ffffff` | 卡片 |
| `mute` | `#8f8a80` | 次要文字 |
| `amber.glow` | `#ff8a3d` | 品牌点缀橙（**少量使用**） |

**风格关键词**：年轻 / 现代 / 高级 / 音乐感 / 克制 / 轻盈 / 有呼吸感。
**禁止**：满屏渐变、过度玻璃拟态、科技感、日记 App 风、Notion 风。

---

## 7. 已完成的核心改动（按时间顺序）

### 7.1 项目冷启动（最早那轮）
- 用户本机无 Node → 用 skill 脚本装好。
- 从 `music-moments.zip` 解压出初始工程，再迭代。

### 7.2 三首歌 + 真实封面
- 用户提供了 3 张真实封面图（在 `/Users/didi/Desktop/个人/`），分别是：
  - `微信图片_20261005140924_134_2.png` → `sunny.jpg`（晴天）
  - `微信图片_20261005173234_137_2.jpg` → `meeting.jpg`（如果我们不曾相遇）
  - `微信图片_20261005173234_139_2.jpg` → `longtime.jpg`（陪你度过漫长岁月）
- 已拷贝到 `public/covers/`。
- **明确禁止**自己画 SVG / 占位图替换。

### 7.3 仿 QQ 音乐播放器（最新一轮，已落地）

`PlayerPage.jsx` 当前长这样（已 build 通过）：

- **顶部导航**：左 ChevronDown，右「萌宠（AudioLines + 红色萌宠 badge）+ Share2」
- **唱片机视觉中心**（`aspect-square w-[86%]`，最大 350px）：
  - 银灰机身（`rounded-[22px]` 渐变 + 大阴影 + ring）
  - **黑胶盘**（74% 大小）：
    - 类名 `spin-slow`，CSS 动画 `24s linear infinite`
    - 暂停时加 `.paused` 类（`animation-play-state: paused`）
    - 内部 `.vinyl-disc` 提供质感：疏密交替的 `repeating-radial-gradient` 刻槽 + `conic-gradient` 径向光泽 + `::after` 中心黑色标签环
    - 圆形封面叠在黑胶中央（46% 大小，`z-10`，跟随黑胶一起转）
  - **唱臂**：右侧，播放时 `rotate-[24deg]`、暂停 `rotate-[10deg]`，700ms 过渡
  - 左侧 Off/On 拨杆、右下开关 → 纯装饰
- **歌曲信息**：左对齐，歌名 24px bold，歌手 14px mute
- **图标一排**（6 个，对应 QQ）：话筒 Mic / 声波 SoundWaveIcon（自定义 SVG）/ 下载 DownloadBoxIcon（自定义圆角方块+下箭头 SVG）/ **留住此刻 ClockIcon（自定义时钟 SVG，带 count badge）** / 评论 MessageCircle / 更多 MoreHorizontal
- **进度条**：1px 高，墨色填充 + 圆形滑块，下面左右时间
- **播放控制**：Shuffle / SkipBack / **64px 圆形 Play/Pause 描边按钮** / SkipForward / ListMusic

### 7.4 「留住此刻」入口 + 气泡引导（最新一轮核心）

`PlayerPage.jsx` 内部 state：

```js
const [showMomentTooltip, setShowMomentTooltip] = useState(false)
const tooltipTimerRef = useRef(null)

// 进入页面 5 秒后自动显示气泡（不自动消失）
useEffect(() => {
  tooltipTimerRef.current = setTimeout(() => setShowMomentTooltip(true), 5000)
  return () => clearTimeout(tooltipTimerRef.current)
}, [])

// 悬浮时钟也显示，移开隐藏
const handleMomentEnter = () => { clearTimeout(tooltipTimerRef.current); setShowMomentTooltip(true) }
const handleMomentLeave = () => setShowMomentTooltip(false)
```

气泡是墨色（`bg-ink`）圆角胶囊，文字「**留下此刻**」，下面一个小三角指向时钟图标。
**故意不自动消失**——用户明确说要"引着评委去点"。

### 7.5 已微调的参数

| 项 | 当前值 | 文件:行 |
|---|---|---|
| 黑胶转速 | `24s` 一圈（animationDuration 内联覆盖） | `PlayerPage.jsx:166` |
| 黑胶刻槽密度 | 疏密交替（3.5px / 6px 两组） | `index.css:81-92` |
| 气泡触发延迟 | 5 秒 | `PlayerPage.jsx:117` |
| 唱片机最大宽 | 350px | `PlayerPage.jsx:155` |

---

## 8. 当前待办（**这就是下一个 AI 要干的事**）

### 8.1 视觉走查（最紧急）

最近一次改动（`Write PlayerPage.jsx` + `Edit index.css`）已经 `npm run build` **0 错误**通过，
并且已经用 `mcp__browser_bridge__screenshot` 截图：
`/Users/didi/.SmartWork/cache/images/screenshots/tab-278389527-2026-10-07T10-40-53-266Z-93168119.png`

**但还没把验证结果回复给用户**——上一轮助手在准备回复时撞到了 LLM provider 的
`input token limit is 1048576` 错误，连续 3 次重试都爆。

**下一个 AI 接手后第一件事**：
1. 让用户起 dev server（`npm run dev`）或直接 build 后预览
2. 重新截图，逐项核对：
   - [ ] 黑胶是否在**旋转**（不是静止）
   - [ ] 黑胶质感是否**仿真**（有刻槽、有反光，不是纯黑饼）
   - [ ] 刻槽**远看能看出来**（不要太密）
   - [ ] 时钟图标在**评论图标前面**
   - [ ] 时钟、话筒、下载、声波图标形状是否到位
   - [ ] 5 秒后气泡是否自动出现（鼠标没悬浮时）
   - [ ] 气泡**不自动消失**
3. 如有偏差，优先微调 `PlayerPage.jsx` 和 `index.css`

### 8.2 用户已确认无需做

- 气泡自动消失 —— 用户说"不用几秒后自动消失，要引着评委去操作"

### 8.3 用户明确禁止

- 不要重做架构、不要换框架、不要加 router
- 不要加 AI 推荐 / 好友匹配 / 音乐盲盒 / 公开广场 / 评论区 / 排行榜 / 年度报告
- 不要把封面换成占位图 / 自绘 SVG
- 不要 1:1 抄 QQ 音乐 UI，但要"像 QQ 音乐会做的功能"

---

## 9. 历史踩过的坑（别再踩）

### 9.1 上下文爆炸（最重要）

上一轮助手在 `be258053-8e8a-46e3-8f13-2af7b6e38598` 会话末尾，因为连续 `Read` 多张大尺寸 PNG 截图，
触发了 LLM provider 的 `input token limit is 1048576` 错误，**整个会话卡死无法继续**。

**教训**：
- 不要在一次会话里读太多张截图。
- 截图后**马上处理并删掉对话里的引用**，不要反复 `Read` 同一张。
- 看到 `input token limit` 错误，意味着这个会话已经救不回来，**直接开新会话**，
  让新会话读本文件。

### 9.2 用户工作节奏

- 用户是非工程师，**不要甩术语**。"HTML 打开一片黑屏" 这种反馈说明 dev server 没起或路径错了。
- 用户会**反复中断让你重做**（"请重新试一次"/"Continue from where you left off"），
  说明上一次回答被 API 错误打断或效果不对，**直接接着做，不要重新解释**。
- 用户会给**多张参考截图**（QQ 音乐真实界面、封面图），要逐张对应到产物，不要漏。

### 9.3 设计审美红线

用户审美**非常挑剔**，过去推翻过的方案：
- 黑胶**纯黑色无质感** → 必须做出仿真的刻槽 + 反光
- 黑胶**静止** → 必须旋转，但**不能太快**（24s 一圈是当前的折中）
- 黑胶**刻槽太密** → 远看要看得出纹路，当前用疏密交替的 repeating-radial-gradient
- 「留住此刻」按钮**位置不对** → 必须在操作图标排里、**评论图标前面**
- 「留住此刻」做成普通按钮 → 改成**时钟图标**，更克制、更"音乐 App"

---

## 10. 关键代码片段（**改动前先读这些**）

### 10.1 黑胶质感（`src/index.css:74-135`）

```css
.vinyl-disc {
  position: absolute; inset: 0; border-radius: 50%;
  background: #0a0a0a;
  /* 疏密交替刻槽：3.5px 一组、6px 一组 */
  background-image: repeating-radial-gradient(
    circle at 50% 50%,
    transparent 0, transparent 3.5px,
    rgba(255,255,255,0.05) 3.5px, rgba(255,255,255,0.05) 4px,
    transparent 4px, transparent 6px,
    rgba(255,255,255,0.028) 6px, rgba(255,255,255,0.028) 6.5px
  );
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    inset 0 0 20px rgba(0,0,0,0.9),
    0 10px 30px rgba(0,0,0,0.55);
}
.vinyl-disc::before { /* 左上→右下径向反光 */ }
.vinyl-disc::after  { /* 中心黑色标签环，z-index:1 */ }
```

### 10.2 黑胶旋转（`src/index.css:67-72`）

```css
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin-slow { animation: spin-slow 24s linear infinite; }
.spin-slow.paused { animation-play-state: paused; }
```

播放时 `<div className="spin-slow ..." style={{ animationDuration: '24s' }}>`，
暂停时额外加 `paused` 类冻结动画。

### 10.3 自定义图标（`PlayerPage.jsx` 顶部）

`lucide-react` 没有完全匹配 QQ 的图标，所以**手写了 3 个内联 SVG 组件**：

- `DownloadBoxIcon`：圆角方框 + 下箭头
- `SoundWaveIcon`：4 条高低错落的竖线（声波）
- `ClockIcon`：时钟（留住此刻入口）

改动图标形状时**优先改这 3 个组件**，不要去翻 lucide 的图标库。

### 10.4 气泡（`PlayerPage.jsx:254-263`）

气泡是带 `border-t-ink` 小三角的胶囊，定位 `bottom-full left-1/2 -translate-x-1/2`，
显示条件 `showMomentTooltip === true`，文字"留下此刻"。

---

## 11. 测试 & 验证流程

```bash
cd /Users/didi/dchat-workplace/music-moments

# 1. 构建验证
npm run build       # 必须 0 错误，产物在 dist/

# 2. dev server（如果要让用户实时看）
npm run dev         # http://localhost:5173

# 3. 截图验证（SmartWork 环境）
# 用 mcp__browser_bridge__openPage 打开 dev server
# 用 mcp__browser_bridge__screenshot 截图
# 用 Read 看截图（注意：一次只读一张，避免 context 爆炸）
```

---

## 12. 联系上下文

- 原始需求对话（最早）：`43838692-4441-4353-a5ea-cfb4d2bf37a1.jsonl`
- 最近一次改动对话（已废，token 爆炸）：`be258053-8e8a-46e3-8f13-2af7b6e38598.jsonl`
- **不需要重读这两个文件**——所有关键信息都已经收敛到本文档。

---

## 13. 给下一个 AI 的 30 秒上手清单

1. `cd /Users/didi/dchat-workplace/music-moments && npm run build` —— 确认能跑通
2. 读 `src/components/PlayerPage.jsx` —— 是最近的焦点
3. 读 `src/index.css` —— 黑胶质感和动画
4. 读 `src/data/mockData.js` —— 数据模型
5. 读 `src/App.jsx` —— 视图状态机
6. 读本文件第 8 节"当前待办" —— 知道下一步该做什么
7. **别重读历史对话** —— 容易再次撞 token 上限

开始干活。
