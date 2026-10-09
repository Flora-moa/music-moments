// ---------- 三首正式 Demo 歌曲 ----------
export const SONGS = [
  { id: 'sunny',    name: '晴天',           artist: '周杰伦', cover: '/covers/sunny.jpg',    duration: 269 }, // 4:29
  { id: 'meeting',  name: '如果我们不曾相遇', artist: '五月天', cover: '/covers/meeting.jpg',  duration: 202 }, // 3:22
  { id: 'longtime', name: '陪你度过漫长岁月', artist: '陈奕迅', cover: '/covers/longtime.jpg', duration: 242 }, // 4:02
]

export const EMOJIS = ['❤️', '🌙', '☀️', '🥹', '🎧', '✨']

// ---------- 预置历史时刻（三首歌三种气质） ----------
// 《晴天》：青春 / 校园 / 旧时光
// 《如果我们不曾相遇》：相遇 / 关系 / 遗憾
// 《陪你度过漫长岁月》：陪伴 / 成长 / 人生阶段
export const PRESET_MOMENTS = [
  // --- 晴天（4 条，跨 3 年）---
  { id: 'p1', songId: 'sunny', text: '跨年夜循环了一晚上。', emoji: '❤️', date: '2023.12.31', createdAt: new Date('2023-12-31T23:40:00').getTime() },
  { id: 'p2', songId: 'sunny', text: '那时候每天早上去图书馆都会听。', emoji: '🎧', date: '2024.08.17', createdAt: new Date('2024-08-17T08:05:00').getTime() },
  { id: 'p3', songId: 'sunny', text: '那天在海边第一次重新听到它。', emoji: '☀️', date: '2025.07.18', createdAt: new Date('2025-07-18T17:20:00').getTime() },
  { id: 'p4', songId: 'sunny', text: '原来我已经很久没有在晚上听这首歌了。', emoji: '🌙', date: '2026.10.04', createdAt: new Date('2026-10-04T23:12:00').getTime() },
  // --- 如果我们不曾相遇（2 条）---
  { id: 'p5', songId: 'meeting', text: '有些歌重新听到的时候，会突然想起一个人。', emoji: '🥹', date: '2025.03.14', createdAt: new Date('2025-03-14T22:30:00').getTime() },
  { id: 'p6', songId: 'meeting', text: '原来我们真的很久没有联系了。', emoji: '🌙', date: '2026.09.21', createdAt: new Date('2026-09-21T23:58:00').getTime() },
  // --- 陪你度过漫长岁月（2 条）---
  { id: 'p7', songId: 'longtime', text: '那段时间每天回家的路上都会听。', emoji: '❤️', date: '2025.11.20', createdAt: new Date('2025-11-20T18:45:00').getTime() },
  { id: 'p8', songId: 'longtime', text: '搬家那天收拾东西，随机到这首，突然就站住了。', emoji: '✨', date: '2026.09.03', createdAt: new Date('2026-09-03T15:20:00').getTime() },
]

// ---------- localStorage ----------
const KEY = 'music-moments:v2'

export function loadMoments() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return [...PRESET_MOMENTS]
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) return [...PRESET_MOMENTS]
    return list
  } catch {
    return [...PRESET_MOMENTS]
  }
}

export function saveMoments(moments) {
  try {
    localStorage.setItem(KEY, JSON.stringify(moments))
  } catch {
    /* 存储失败不阻塞 Demo */
  }
}

export function formatDate(ts) {
  const d = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

export function daysBetween(earlierTs, laterTs) {
  return Math.max(0, Math.floor((laterTs - earlierTs) / 86400000))
}
