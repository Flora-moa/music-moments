import { useRef, useState } from 'react'
import { ChevronLeft, Download, Check } from 'lucide-react'
import html2canvas from 'html2canvas'

const TEMPLATES = [
  { key: 'minimal', label: '记忆留白' },
  { key: 'lyric', label: '歌词背景' },
  { key: 'vinyl', label: '唱片收藏' },
]

/* 每首歌对应的歌词（背景纹理用） */
const SONG_LYRICS = {
  sunny: '故事的小黄花 从出生那年就飘着',
  meeting: '如果我们不曾相遇 我会是在哪里',
  longtime: '陪你度过漫长岁月 把想念的酸 拥抱成温暖',
}

export default function ShareCard({ moment, song, onBack }) {
  const [template, setTemplate] = useState('minimal')
  const [saved, setSaved] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef(null)

  const isFullSong = moment?.isFullSong === true
  const momentsList = isFullSong ? moment.moments : [moment]
  const lyric = SONG_LYRICS[song.id] || SONG_LYRICS.sunny

  async function handleSave() {
    if (downloading) return
    setDownloading(true)
    const el = cardRef.current
    // 整首歌模式：截图前临时撑开到完整高度，截图后恢复
    const prevMaxH = el.style.maxHeight
    const prevOverflow = el.style.overflowY
    if (isFullSong) {
      el.style.maxHeight = 'none'
      el.style.overflowY = 'visible'
    }
    try {
      const canvas = await html2canvas(el, {
        scale: 3, // 3 倍导出，最终 1080×1350
        useCORS: true,
        backgroundColor: null,
        logging: false,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      const filename = isFullSong
        ? `音乐时刻-${song.name}-全部${momentsList.length}个时刻.png`
        : `音乐时刻-${song.name}-${moment.date.replace(/\./g, '')}.png`
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setSaved(true)
      setTimeout(() => setSaved(false), 1800)
    } catch (err) {
      console.error('保存图片失败', err)
      alert('保存失败，请重试')
    } finally {
      // 恢复预览容器的限高
      if (isFullSong) {
        el.style.maxHeight = prevMaxH
        el.style.overflowY = prevOverflow
      }
      setDownloading(false)
    }
  }

  return (
    <div className="anim-fade-in flex h-dvh max-h-dvh flex-col overflow-hidden bg-paper px-6 pb-6 pt-5">
      {/* 顶部：只保留返回按钮，无装饰文字 */}
      <header className="flex shrink-0 items-center justify-between">
        <button
          onClick={onBack}
          className="-ml-2 rounded-full p-2 text-mute transition hover:bg-black/5 hover:text-ink"
          aria-label="返回"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="w-9" />
      </header>

      {/* 模板切换 */}
      <div className="mt-4 flex shrink-0 justify-center gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.key}
            onClick={() => setTemplate(t.key)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition ${
              template === t.key
                ? 'bg-ink text-paper'
                : 'bg-black/[0.04] text-mute hover:bg-black/[0.08]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 卡片预览：4:5 比例，限高不挤出底部按钮 */}
      <div className="mt-6 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          ref={cardRef}
          className={`anim-fade-scale relative w-full max-w-[360px] overflow-hidden rounded-[24px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] ${
            isFullSong ? 'max-h-full overflow-y-auto' : 'aspect-[4/5]'
          }`}
        >
          {/* ========== 模板 1：记忆留白（默认） ========== */}
          {template === 'minimal' && (
            <div className="flex h-full flex-col bg-paper">
              {/* 上半部：封面（大面积裁切，不模糊） */}
              <div className="relative h-[45%] overflow-hidden">
                <img
                  src={song.cover}
                  alt={song.name}
                  className="h-full w-full scale-110 object-cover"
                  draggable={false}
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/20" />
              </div>

              {/* 下半部：Moment 文字（视觉中心） */}
              <div className="flex flex-1 flex-col justify-between p-6">
                {isFullSong ? (
                  /* 整首歌模式：时间线 */
                  <div className="space-y-3">
                    {momentsList.map((m) => (
                      <div key={m.id} className="flex gap-3">
                        <div className="w-[42px] shrink-0 text-right">
                          <p className="text-[11px] font-semibold tabular-nums text-ink/70">
                            {m.date.slice(5)}
                          </p>
                          <p className="text-[9px] tabular-nums text-mute">
                            {m.date.slice(0, 4)}
                          </p>
                        </div>
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                        <div className="min-w-0 flex-1">
                          {m.emoji && <span className="mr-1 text-sm">{m.emoji}</span>}
                          <p className="inline font-serifcn text-[13px] leading-relaxed text-ink">
                            {m.text || '（没有文字）'}
                          </p>
                          {m.image && (
                            <img
                              src={m.image}
                              alt=""
                              className="mt-2 h-16 w-16 rounded-lg object-cover ring-1 ring-black/5"
                              crossOrigin="anonymous"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 单时刻模式：居中大字 */
                  <div className="flex flex-1 flex-col items-start justify-center">
                    {moment.emoji && (
                      <span className="mb-4 text-4xl">{moment.emoji}</span>
                    )}
                    <p className="font-serifcn text-[24px] font-medium leading-[1.6] text-ink">
                      {moment.text || '此刻无声。'}
                    </p>
                    {moment.image && (
                      <img
                        src={moment.image}
                        alt="此刻的照片"
                        className="mt-4 h-32 w-32 rounded-xl object-cover ring-1 ring-black/5"
                        draggable={false}
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                )}

                {/* 底部：日期 + 歌曲信息 */}
                <div className="mt-auto pt-4">
                  <p className="text-xs tabular-nums text-mute">
                    {isFullSong ? `${momentsList.length} 个时刻` : moment.date}
                  </p>
                  <p className="mt-1 text-[11px] text-mute">
                    《{song.name}》 · {song.artist}
                  </p>
                  <p className="mt-2 text-[9px] tracking-[0.35em] text-mute/50">
                    留下我的音乐时刻
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========== 模板 2：歌词背景 ========== */}
          {template === 'lyric' && (
            <div className="relative flex h-full flex-col bg-gradient-to-br from-[#1a2233] via-[#12151f] to-[#0d0f14]">
              {/* 背景：极淡歌词大字 */}
              <p className="absolute -left-3 top-10 select-none font-serifcn text-[64px] font-bold leading-[1.6] text-white/[0.06]">
                {lyric}
              </p>

              {/* 前景：Moment 文字居中 */}
              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={song.cover}
                    alt={song.name}
                    className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
                    draggable={false}
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className="font-serifcn text-[16px] font-bold text-white">
                      《{song.name}》
                    </p>
                    <p className="text-[11px] text-white/60">{song.artist}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-start justify-center">
                  {isFullSong ? (
                    <div className="space-y-3">
                      {momentsList.map((m) => (
                        <div key={m.id} className="flex gap-3">
                          <div className="w-[42px] shrink-0 text-right">
                            <p className="text-[11px] font-semibold tabular-nums text-white/70">
                              {m.date.slice(5)}
                            </p>
                            <p className="text-[9px] tabular-nums text-white/50">
                              {m.date.slice(0, 4)}
                            </p>
                          </div>
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                          <div className="min-w-0 flex-1">
                            {m.emoji && <span className="mr-1 text-sm">{m.emoji}</span>}
                            <p className="inline font-serifcn text-[13px] leading-relaxed text-white/90">
                              {m.text || '（没有文字）'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {moment.emoji && (
                        <span className="mb-4 text-4xl">{moment.emoji}</span>
                      )}
                      <p className="font-serifcn text-[19px] font-medium leading-[1.8] text-white">
                        {moment.text || '此刻无声。'}
                      </p>
                      {moment.image && (
                        <img
                          src={moment.image}
                          alt="此刻的照片"
                          className="mt-4 h-24 w-24 rounded-xl object-cover ring-1 ring-white/20"
                          draggable={false}
                          crossOrigin="anonymous"
                        />
                      )}
                    </>
                  )}
                </div>

                <div className="mt-auto">
                  <p className="text-xs tabular-nums text-white/70">
                    {isFullSong ? `${momentsList.length} 个时刻` : moment.date}
                  </p>
                  <p className="mt-1 text-[10px] tracking-[0.35em] text-white/45">
                    留下我的音乐时刻
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========== 模板 3：唱片收藏 ========== */}
          {template === 'vinyl' && (
            <div className="flex h-full flex-col bg-gradient-to-br from-[#2c241b] via-[#1f1812] to-[#14100c] p-6">
              {/* 上半部：圆形黑胶 + 封面 */}
              <div className="relative flex h-[50%] items-center justify-center">
                <div className="relative aspect-square w-[70%]">
                  {/* 黑胶盘 */}
                  <div className="absolute inset-0 rounded-full bg-[#0a0a0a] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent" />
                  </div>
                  {/* 封面 */}
                  <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-2 ring-white/10">
                    <img
                      src={song.cover}
                      alt={song.name}
                      className="h-full w-full object-cover"
                      draggable={false}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>

              {/* 下半部：Moment + 歌曲信息 */}
              <div className="mt-auto">
                {isFullSong ? (
                  <div className="space-y-2">
                    {momentsList.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex items-baseline gap-2">
                        <span className="text-[10px] tabular-nums text-white/50">{m.date.slice(5)}</span>
                        {m.emoji && <span className="text-sm">{m.emoji}</span>}
                        <p className="flex-1 truncate font-serifcn text-[12px] text-white/80">
                          {m.text || '（没有文字）'}
                        </p>
                      </div>
                    ))}
                    {momentsList.length > 3 && (
                      <p className="text-center text-[10px] text-white/40">
                        还有 {momentsList.length - 3} 个时刻…
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {moment.emoji && (
                      <span className="mb-2 block text-3xl">{moment.emoji}</span>
                    )}
                    <p className="font-serifcn text-[16px] font-medium leading-[1.6] text-white">
                      {moment.text || '此刻无声。'}
                    </p>
                  </>
                )}

                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="font-serifcn text-[14px] font-bold text-white">
                    《{song.name}》
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/60">{song.artist}</p>
                  <p className="mt-2 text-[9px] tracking-[0.35em] text-white/40">
                    {isFullSong ? `${momentsList.length} 个时刻` : moment.date}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作：固定底部，不被挤出屏幕 */}
      <div className="mt-4 shrink-0 space-y-3">
        <button
          onClick={handleSave}
          disabled={downloading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-paper transition active:scale-[0.98] disabled:opacity-60"
        >
          {saved ? (
            <>
              <Check size={16} strokeWidth={2.6} />
              已保存到相册
            </>
          ) : downloading ? (
            <>
              <Download size={16} className="animate-pulse" />
              正在生成图片…
            </>
          ) : (
            <>
              <Download size={16} />
              保存图片
            </>
          )}
        </button>
      </div>
    </div>
  )
}
