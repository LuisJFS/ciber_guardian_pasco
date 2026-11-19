import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/ciber_guardian_pasco/',
  plugins: [react()],
})
