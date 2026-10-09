/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 浅色音乐产品基调：纸面 / 墨色文字
        ink: '#191613',        // 主文字（近黑）
        paper: '#f7f5f0',      // 页面底
        card: '#ffffff',       // 卡片
        line: 'rgba(25,22,19,0.10)',
        cream: '#191613',      // 兼容旧类名：旧“亮文字”即今“主文字”
        mute: '#8f8a80',       // 次要文字
        amber: {
          glow: '#ff8a3d',     // 品牌点缀（活力橙，非金色）
        },
      },
      fontFamily: {
        serifcn: ['"Songti SC"', '"Noto Serif SC"', 'serif'],
      },
    },
  },
  plugins: [],
}
