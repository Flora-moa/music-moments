import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

// 保存成功后的“情绪瞬间”：遇见过去的自己
// 节奏：第一层 0ms → 第二层 900ms → 历史卡片 1400ms → 操作 2000ms
export default function MomentSavedModal({ data, song, onViewPast, onLater }) {
  const { pastMoment } = data
  const [step, setStep] = useState(1)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1400),
      setTimeout(() => setStep(4), 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-paper px-8">
      {/* 封面氛围：与播放器同源，保存瞬间不离场 */}
      {song && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <img
            src={song.cover}
            alt=""
            className="h-full w-full scale-125 object-cover opacity-25 blur-3xl saturate-150"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/80 to-paper" />
        </div>
      )}

      <div className="relative w-full max-w-[340px]">
        {/* 第一层：已留下 */}
        <div className="anim-fade-scale text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
            <Check size={24} strokeWidth={2.5} />
          </span>
          <h2 className="mt-5 text-[24px] font-bold leading-snug tracking-wide text-ink">
            这个时刻
            <br />
            已经被留下。
          </h2>
        </div>

        {/* 第二层：提示过去 */}
        {step >= 2 && (
          <p className="anim-rise mt-10 text-center text-[13px] text-mute">
            {pastMoment
              ? '你曾经也在这首歌里留下过一个时刻。'
              : '这是你在这首歌里的第一个时刻。'}
          </p>
        )}

        {/* 第三层：过去的 Moment（信物感） */}
        {step >= 3 && pastMoment && (
          <div className="anim-rise relative mt-4 rounded-3xl border border-black/5 bg-white/90 p-5 shadow-[0_20px_50px_-20px_rgba(120,74,43,0.35)] backdrop-blur">
            <span className="absolute left-0 top-5 h-[calc(100%-2.5rem)] w-[3px] rounded-full bg-amber-glow/70" />
            <div className="flex items-center justify-between">
              <span className="text-xs tabular-nums tracking-wider text-mute">
                {pastMoment.date}
              </span>
              <span className="text-xl">{pastMoment.emoji}</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink">
              {pastMoment.text}
            </p>
          </div>
        )}
        {step >= 3 && !pastMoment && (
          <p className="anim-rise mt-3 text-center text-[13px] leading-relaxed text-mute">
            以后再来，会遇见今天的自己。
          </p>
        )}

        {/* 第四层：操作 */}
        {step >= 4 && (
          <div className="anim-rise mt-7">
            {pastMoment && (
              <button
                onClick={onViewPast}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-ink py-3.5 text-[14px] font-semibold text-paper transition active:scale-[0.98]"
              >
                看看过去的我
                <ArrowRight size={15} />
              </button>
            )}
            <button
              onClick={onLater}
              className="mt-4 w-full py-2 text-center text-[13px] text-mute transition hover:text-ink"
            >
              稍后再看
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
