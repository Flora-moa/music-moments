import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SONGS } from '../data/mockData.js'

// 我的音乐时刻：顶部可切「这首歌的时刻 / 全部时刻」
export default function MyMoments({ moments, currentSongId, onBack, onOpenSong, onShareMoment }) {
  const [tab, setTab] = useState('song') // 'song' | 'all' — 默认先看这首歌的时刻

  const currentSong = SONGS.find((s) => s.id === currentSongId) || SONGS[0]
  const songMoments = useMemo(
    () => moments.filter((m) => m.songId === currentSongId).sort((a, b) => b.createdAt - a.createdAt),
    [moments, currentSongId],
  )

  const allSorted = useMemo(
    () => [...moments].sort((a, b) => b.createdAt - a.createdAt),
    [moments],
  )

  const list = tab === 'song' ? songMoments : allSorted

  return (
    <div className="anim-fade-in flex h-dvh max-h-dvh flex-col overflow-hidden px-6 pb-4 pt-5">
      <header className="flex shrink-0 items-center justify-between">
        <button
          onClick={onBack}
          className="-ml-2 rounded-full p-2 text-mute transition hover:bg-black/5 hover:text-ink"
          aria-label="返回"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="text-[15px] font-semibold text-ink">我的音乐时刻</span>
        <span className="w-9" />
      </header>

      {/* 两个查看方向 */}
      <div className="mt-5 shrink-0 rounded-full bg-black/[0.05] p-1">
        <div className="flex gap-1">
          {[
            { key: 'song', label: '这首歌的时刻' },
            { key: 'all', label: '全部时刻' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-full py-2 text-[13px] font-medium transition ${
                tab === key ? 'bg-white text-ink shadow-sm' : 'text-mute'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 时刻流：flex-1 填充剩余空间，内部滚动 */}
      <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5">
        {list.length === 0 && (
          <p className="py-16 text-center text-sm text-mute">
            {tab === 'song' ? '这首歌还没有时刻。' : '还没有留下任何时刻。'}
          </p>
        )}
        <div className="pb-4">
          {list.map((m, i) => {
            const song = SONGS.find((s) => s.id === m.songId)
            return (
              <button
                key={m.id}
                onClick={() => onShareMoment(m)}
                className="anim-rise mb-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-card p-3.5 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.06)] transition active:scale-[0.99]"
                style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s` }}
              >
                {song && (
                  <img
                    src={song.cover}
                    alt={song.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    draggable={false}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-ink">《{song?.name}》</span>
                    <span className="text-[11px] tabular-nums text-mute">{m.date}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-mute">
                    {m.emoji && <span className="mr-1">{m.emoji}</span>}
                    {m.text || '（没有文字）'}
                  </p>
                  {m.image && (
                    <img
                      src={m.image}
                      alt="此刻的照片"
                      className="mt-2 h-16 w-16 rounded-lg object-cover ring-1 ring-black/5"
                      draggable={false}
                    />
                  )}
                </div>
                <ChevronRight size={16} className="shrink-0 text-mute/50" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
