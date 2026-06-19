import 'dotenv/config'
import app from './app'

const PORT = process.env.PORT ?? 3000

const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT} (e IP de rede local)`)
})

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason)
  server.close(() => process.exit(1))
})