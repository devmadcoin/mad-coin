import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function pumpTapePlugin() {
  return {
    name: 'pump-tape-api',
    configureServer(server: any) {
      server.middlewares.use(pumpTapeMiddleware)
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(pumpTapeMiddleware)
    },
  }
}

async function pumpTapeMiddleware(
  req: { url?: string },
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void },
  next: () => void,
) {
  const url = req.url?.split('?')[0]
  if (url !== '/api/pump-tape') {
    next()
    return
  }
  try {
    const mod = await import('./api/pump-tape.js') as { GET: () => Promise<Response> }
    const response = await mod.GET()
    const text = await response.text()
    res.statusCode = response.status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(text)
  } catch {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(
      JSON.stringify({
        ok: false,
        status: 'Tape feed unreachable. No seeded prints.',
        deskSol: 0,
        openClips: 0,
        prints: [],
      }),
    )
  }
}

export default defineConfig({
  plugins: [react(), pumpTapePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
