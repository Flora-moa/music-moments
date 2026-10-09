import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 本地开发用根路径，生产构建用 GitHub Pages 子路径
  base: process.env.NODE_ENV === 'production' ? '/music-moments/' : '/',
})
