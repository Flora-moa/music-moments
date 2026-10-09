import { useEffect, useMemo, useState } from 'react'
import PlayerPage from './components/PlayerPage.jsx'
import MomentSheet from './components/MomentSheet.jsx'
import MomentSavedModal from './components/MomentSavedModal.jsx'
import MyMoments from './components/MyMoments.jsx'
import ShareCard from './components/ShareCard.jsx'
import { SONGS, loadMoments, saveMoments, formatDate } from './data/mockData.js'

// 单页状态机：player | all | share
// 无底部 Tab —— 它是播放器里的一个功能，不是独立 App
export default function App() {
  const [songIdx, setSongIdx] = useState(0) // 当前歌曲下标（三首循环）
  const [view, setView] = useState('player') // 'player' | 'all' | 'share'
  const [moments, setMoments] = useState(loadMoments)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [savedModal, setSavedModal] = useState(null)
  const [shareMoment, setShareMoment] = useState(null)
  const [shareFrom, setShareFrom] = useState('player') // 记录分享来源，用于返回
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    saveMoments(moments)
  }, [moments])

  const currentSong = SONGS[songIdx]

  // 切歌：三首循环
  function prevSong() {
    setSongIdx((i) => (i - 1 + SONGS.length) % SONGS.length)
  }
  function nextSong() {
    setSongIdx((i) => (i + 1) % SONGS.length)
  }

  const currentSongMoments = useMemo(
    () =>
      moments
        .filter((m) => m.songId === currentSong.id)
        .sort((a, b) => b.createdAt - a.createdAt),
    [moments, currentSong.id],
  )

  function findPastMoment(songId, excludeId) {
    const list = moments
      .filter((m) => m.songId === songId && m.id !== excludeId)
      .sort((a, b) => b.createdAt - a.createdAt)
    return list[0] || null
  }

  function handleSaveMoment({ text, emoji, photo }) {
    const now = Date.now()
    const moment = {
      id: `m-${now}`,
      songId: currentSong.id,
      text: text.trim(),
      emoji: emoji || null,
      image: photo || null,
      date: formatDate(now),
      createdAt: now,
    }
    const past = findPastMoment(currentSong.id, moment.id)
    setMoments((prev) => [...prev, moment])
    setSheetOpen(false)
    setTimeout(() => setSavedModal({ moment, pastMoment: past }), 350)
  }

  function openShare(moment, from = 'all') {
    setShareMoment(moment)
    setShareFrom(from)
    setView('share')
    window.scrollTo(0, 0)
  }

  function openShareAll(song, songMoments, from = 'all') {
    // 整首歌分享：传特殊对象标记为"整首歌模式"
    setShareMoment({
      isFullSong: true,
      songId: song.id,
      moments: songMoments,
    })
    setShareFrom(from)
    setView('share')
    window.scrollTo(0, 0)
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-[420px] flex-col bg-paper">
      {view === 'player' && (
        <PlayerPage
          song={currentSong}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          onPrev={prevSong}
          onNext={nextSong}
          moments={currentSongMoments}
          onOpenSheet={() => setSheetOpen(true)}
        />
      )}

      {view === 'all' && (
        <MyMoments
          moments={moments}
          currentSongId={currentSong.id}
          onBack={() => setView('player')}
          onShareMoment={(moment) => openShare(moment, 'all')}
        />
      )}

      {view === 'share' && shareMoment && (
        <ShareCard
          moment={shareMoment}
          song={SONGS.find((s) => s.id === shareMoment.songId) || currentSong}
          onBack={() => {
            // 根据来源返回对应页面
            if (shareFrom === 'player') setView('player')
            else setView('all')
          }}
        />
      )}

      {sheetOpen && (
        <MomentSheet
          song={currentSong}
          onClose={() => setSheetOpen(false)}
          onSave={handleSaveMoment}
          onViewMoments={() => {
            setSheetOpen(false)
            setView('all')
          }}
        />
      )}

      {savedModal && (
        <MomentSavedModal
          data={savedModal}
          song={currentSong}
          onViewPast={() => {
            setSavedModal(null)
            setView('all')
          }}
          onLater={() => setSavedModal(null)}
        />
      )}
    </div>
  )
}
