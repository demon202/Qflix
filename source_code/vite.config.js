import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const REPO_NAME = 'Qflix';

// https://vite.dev/config/
export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss(),],
})
