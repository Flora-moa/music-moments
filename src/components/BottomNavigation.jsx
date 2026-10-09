import { Music2, Clock3 } from 'lucide-react'

export default function BottomNavigation({ tab, onChange }) {
  const items = [
    { key: 'home', label: '首页', icon: Music2 },
    { key: 'my', label: '我的时刻', icon: Clock3 },
  ]
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[420px] -translate-x-1/2 border-t border-line bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="flex">
        {items.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                active ? 'text-ink' : 'text-mute'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {label}
              <span
                className={`h-0.5 w-6 rounded-full transition-all ${
                  active ? 'bg-amber-glow opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
