import { useRef, useState } from 'react'
import { X, ImagePlus, ChevronRight } from 'lucide-react'

export default function MomentSheet({ song, onClose, onSave, onViewMoments }) {
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)
  const fileRef = useRef(null)

  function onPhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // 转成 base64 持久化存储（localStorage 不会因为刷新失效）
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const canSave = text.trim().length > 0 || photo !== null

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* 顶部 30% 透明遮罩（点击关闭） */}
      <button
        aria-label="关闭"
        onClick={onClose}
        className="anim-fade-in h-[30%] w-full bg-black/45 backdrop-blur-[3px]"
      />

      {/* 底部 70% 嵌入式卡片（固定高度，避免动画卡顿） */}
      <div
        className="anim-sheet-up flex flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.15)]"
        style={{ height: '70%' }}
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-black/10" />

        {/* 头部：标题 + 关闭 */}
        <div className="mt-4 flex shrink-0 items-start justify-between px-5">
          <div>
            <h2 className="text-[18px] font-bold text-ink">留下此刻</h2>
            <p className="mt-0.5 text-[13px] text-mute">这首歌现在让你想起什么？</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-mute transition hover:bg-black/5 hover:text-ink"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        {/* 歌曲缩略：此刻绑在这首歌上 */}
        {song && (
          <div className="mt-4 flex shrink-0 items-center gap-3 px-5">
            <div className="rounded-2xl bg-paper p-3">
              <img
                src={song.cover}
                alt={song.name}
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-black/5"
                draggable={false}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-ink">《{song.name}》</p>
              <p className="text-[12px] text-mute">{song.artist}</p>
            </div>
          </div>
        )}

        {/* 内容区：可滚动 */}
        <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-5 pb-2">
          {/* 输入区 */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下一点此刻的感觉……"
            rows={3}
            className="w-full resize-none rounded-2xl border border-line bg-paper/70 p-3.5 text-[15px] leading-[1.6] text-ink placeholder:text-mute/60 focus:border-ink/30 focus:outline-none"
          />

          {/* 照片 */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
          {photo ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line p-2.5 text-left"
            >
              <img src={photo} alt="此刻的照片" className="h-14 w-14 rounded-xl object-cover ring-1 ring-black/5" />
              <span className="text-[13px] text-mute">此刻的照片 · 点击更换</span>
            </button>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-3 text-[13px] text-mute transition hover:border-ink/30 hover:text-ink"
            >
              <ImagePlus size={16} />
              添加照片
            </button>
          )}
        </div>

        {/* 底部操作：固定在下方 */}
        <div className="shrink-0 border-t border-line bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
          {/* 主操作：保存 */}
          <button
            onClick={() => onSave({ text, emoji: null, photo })}
            disabled={!canSave}
            className="w-full rounded-full bg-ink py-3.5 text-[16px] font-semibold text-paper shadow-[0_12px_30px_-8px_rgba(25,22,19,0.4)] transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            保存这个时刻
          </button>

          {/* 次级入口：查看我的时刻 */}
          <button
            onClick={onViewMoments}
            className="mt-2 flex w-full items-center justify-center gap-1 py-2.5 text-[13px] text-mute transition hover:text-ink"
          >
            查看我的时刻
            <ChevronRight size={14} />
          </button>

          <p className="mt-1 text-center text-[11px] text-mute/70">
            写一句话或添加一张照片，就能留下此刻
          </p>
        </div>
      </div>
    </div>
  )
}
