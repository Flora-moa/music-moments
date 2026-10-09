import { useEffect, useRef, useState } from 'react'
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  ChevronDown,
  Share2,
  Shuffle,
  ListMusic,
  MessageCircle,
  AudioLines,
  MoreHorizontal,
  NotebookPen,
  Heart,
} from 'lucide-react'

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = String(Math.floor(sec % 60)).padStart(2, '0')
  return `${m}:${s}`
}

/* 自定义 SVG：演唱麦克风 + 右侧水平声波（对齐 QQ 第1个图标） */
function MicWaveIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 麦克风头 */}
      <rect x="4" y="3" width="6" height="10" rx="3" />
      {/* 麦克风柄 */}
      <path d="M7 16v3" />
      {/* 麦克风底座弧 */}
      <path d="M3.5 11a3.5 3.5 0 0 0 7 0" />
      {/* 右侧 3 条水平声波（长度递增） */}
      <line x1="14" y1="6" x2="17" y2="6" />
      <line x1="14" y1="10" x2="19" y2="10" />
      <line x1="14" y1="14" x2="16.5" y2="14" />
    </svg>
  )
}

/* 自定义 SVG：音效调节（2 条竖线 + 每条中间一个圆点，对齐 QQ 第2个图标） */
function EqualizerIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      {/* 左竖线 */}
      <line x1="8" y1="4" x2="8" y2="20" />
      {/* 右竖线 */}
      <line x1="16" y1="4" x2="16" y2="20" />
      {/* 左线上的圆点（偏上） */}
      <circle cx="8" cy="9" r="2.2" fill="currentColor" stroke="none" />
      {/* 右线上的圆点（偏下） */}
      <circle cx="16" cy="15" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* 自定义 SVG：圆角方框 + 下箭头（对齐 QQ 下载图标，更圆润） */
function DownloadBoxIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M12 8v7.5" />
      <path d="m8.7 12.7 3.3 3.3 3.3-3.3" />
    </svg>
  )
}

/* 三首歌的氛围渐变（上半部分纯白，下半部分浅色，形成"浮起来的唱片机"效果） */
const SONG_ATMOSPHERE = {
  sunny: 'from-white via-[#fff8f0] to-[#ffe8d6]',      // 晴天：白 → 浅橙
  meeting: 'from-white via-[#f0f4f8] to-[#d9e2ec]',    // 相遇：白 → 浅蓝灰
  longtime: 'from-white via-[#f8f6f0] to-[#e8e4d8]',   // 漫长岁月：白 → 浅米黄
}

export default function PlayerPage({
  song,
  playing,
  onTogglePlay,
  onPrev,
  onNext,
  moments,
  onOpenSheet,
}) {
  const [progress, setProgress] = useState(0)
  const timer = useRef(null)

  useEffect(() => {
    setProgress(0)
  }, [song.id])

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(
        () => setProgress((p) => (p + 1) % song.duration),
        1000,
      )
    }
    return () => clearInterval(timer.current)
  }, [playing, song.duration, song.id])

  const pct = (progress / song.duration) * 100
  const atmosphere = SONG_ATMOSPHERE[song.id] || SONG_ATMOSPHERE.sunny

  /* 收藏状态（虚拟数据） */
  const [favorited, setFavorited] = useState(false)

  return (
    <div className={`anim-fade-in relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-gradient-to-b transition-colors duration-700 ${atmosphere}`}>
      {/* 内容区：直接在渐变上，无卡片浮层 */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* 顶部导航 */}
        <header className="flex shrink-0 items-center justify-between px-5 pt-3">
          <button className="-ml-2 rounded-full p-2 text-ink/60 transition hover:bg-black/5" aria-label="收起">
            <ChevronDown size={22} />
          </button>
          <div className="flex items-center gap-1">
            <button className="relative rounded-full p-2 text-ink/60 transition hover:bg-black/5" aria-label="萌宠">
              <AudioLines size={19} />
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">萌宠</span>
            </button>
            <button className="rounded-full p-2 text-ink/60 transition hover:bg-black/5" aria-label="分享">
              <Share2 size={19} />
            </button>
          </div>
        </header>

        {/* 唱片机：直接在渐变上，同时受宽高约束 */}
        <div className="mt-2 flex shrink-0 justify-center px-5">
          <div
            className="relative aspect-square"
            style={{
              width: 'min(86vw, 40vh)',
            }}
          >
            {/* 机身 */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#d7d7d9] via-[#c9c9cc] to-[#b8b8bc] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10" />
            {/* 机身顶部凹槽高光 */}
            <div className="absolute inset-x-6 top-2 h-px bg-white/50" />

            {/* 黑胶盘：跟随播放状态旋转 */}
            <div
              className={`spin-slow absolute left-[13%] top-[13%] h-[74%] w-[74%] rounded-full ${
                playing ? '' : 'paused'
              }`}
              style={{ animationDuration: '24s' }}
            >
              {/* 真实黑胶质感层 */}
              <div className="vinyl-disc" />
              {/* 中心封面 */}
              <div className="absolute left-1/2 top-1/2 z-10 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-1 ring-white/25">
                <img
                  key={song.id}
                  src={song.cover}
                  alt={song.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>

            {/* 唱臂（右侧） */}
            <div className="absolute right-[3%] top-[8%] h-[64%] w-[16%]">
              {/* 支点 */}
              <div className="absolute right-0 top-0 h-11 w-11 rounded-full bg-gradient-to-br from-[#e9e9eb] to-[#a9a9ad] shadow-md ring-1 ring-black/15">
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#6a6a6e] to-[#3c3c40]" />
              </div>
              {/* 臂杆 */}
              <div
                className={`absolute right-[38%] top-[10%] h-[74%] w-[7px] origin-top rounded-full bg-gradient-to-b from-[#e2e2e4] to-[#9c9ca0] shadow-sm transition-transform duration-700 ${
                  playing ? 'rotate-[24deg]' : 'rotate-[10deg]'
                }`}
              >
                {/* 唱头 */}
                <div className="absolute bottom-0 left-1/2 h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-md bg-gradient-to-br from-[#6d6d72] to-[#3a3a3e] shadow-md" />
              </div>
            </div>

            {/* 左侧 Off/On 拨杆 */}
            <div className="absolute left-[5%] top-[52%] flex flex-col items-center">
              <div className="h-12 w-[10px] rounded-full bg-gradient-to-b from-[#4a4a4e] to-[#2c2c30] shadow-inner" />
              <span className="mt-1 text-[7px] font-medium tracking-wider text-black/40">Off&nbsp;On</span>
            </div>

            {/* 右下开关 */}
            <div className="absolute bottom-[8%] right-[7%] flex flex-col items-center">
              <div className="h-9 w-[14px] rounded-[4px] bg-gradient-to-b from-[#d9d9dc] to-[#a5a5a9] shadow ring-1 ring-black/10">
                <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-black/30" />
              </div>
              <div className="mt-1 flex gap-2 text-[7px] text-black/35">
                <span>○</span><span>○</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下半部分：直接在渐变上（歌名、图标、进度条、播放控制） */}
        <div className="mt-8 flex flex-1 flex-col overflow-hidden px-5 pb-4 pt-4">
          {/* 歌曲信息：歌名+歌手在左，收藏爱心在右 */}
          <div className="flex shrink-0 items-start justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[24px] font-bold leading-tight tracking-wide text-ink">
                {song.name}
              </h1>
              <p className="mt-0.5 truncate text-[14px] text-mute">{song.artist}</p>
            </div>

            {/* 收藏爱心（只保留图标，无数字） */}
            <button
              onClick={() => setFavorited((v) => !v)}
              className="flex shrink-0 items-center text-ink/70 transition hover:text-ink active:scale-95"
              aria-label={favorited ? '取消收藏' : '收藏'}
            >
              <Heart
                size={22}
                strokeWidth={1.8}
                className={favorited ? 'fill-red-500 text-red-500' : ''}
              />
            </button>
          </div>

          {/* 一排操作图标（6 个：K歌 / 音效 / 下载 / 留下此刻 / 评论 / 更多） */}
          <div className="mt-10 flex shrink-0 items-center justify-around text-ink/70">
            <button className="p-2 transition hover:text-ink" aria-label="K歌">
              <MicWaveIcon size={20} />
            </button>
            <button className="p-2 transition hover:text-ink" aria-label="音效">
              <EqualizerIcon size={20} />
            </button>
            <button className="p-2 transition hover:text-ink" aria-label="下载">
              <DownloadBoxIcon size={20} />
            </button>
            {/* 留下此刻：笔记本+笔图标 + 数量徽标（右上角） */}
            <button
              onClick={onOpenSheet}
              className="relative p-2 transition hover:text-ink active:scale-95"
              aria-label="留下此刻"
            >
              <NotebookPen size={20} strokeWidth={1.8} />
              {moments.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold tabular-nums text-paper">
                  {moments.length}
                </span>
              )}
            </button>
            {/* 评论：只保留图标，无数字 */}
            <button className="p-2 transition hover:text-ink" aria-label="评论">
              <MessageCircle size={20} />
            </button>
            <button className="p-2 transition hover:text-ink" aria-label="更多">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* 进度条 */}
          <div className="mt-8 shrink-0">
            <div className="relative h-1 w-full rounded-full bg-black/15">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
              <span
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-sm"
                style={{ left: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-ink/50">
              <span>{fmt(progress)}</span>
              <span>{fmt(song.duration)}</span>
            </div>
          </div>

          {/* 播放控制 */}
          <div className="mt-3 flex shrink-0 items-center justify-between px-1 pb-2">
            <button className="p-2 text-ink/55 transition hover:text-ink" aria-label="循环模式">
              <Shuffle size={20} />
            </button>
            <button onClick={onPrev} className="p-2 text-ink transition active:scale-90" aria-label="上一首">
              <SkipBack size={26} fill="currentColor" strokeWidth={0} />
            </button>
            <button
              onClick={onTogglePlay}
              className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-[2.5px] border-ink text-ink transition active:scale-95"
              aria-label={playing ? '暂停' : '播放'}
            >
              {playing ? (
                <Pause size={26} fill="currentColor" strokeWidth={0} />
              ) : (
                <Play size={26} fill="currentColor" strokeWidth={0} className="ml-1" />
              )}
            </button>
            <button onClick={onNext} className="p-2 text-ink transition active:scale-90" aria-label="下一首">
              <SkipForward size={26} fill="currentColor" strokeWidth={0} />
            </button>
            <button className="p-2 text-ink/55 transition hover:text-ink" aria-label="播放列表">
              <ListMusic size={21} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
