import express from 'express'
import { errorHandler } from './shared/middlewares/erroHandler'
import authRoutes from './modules/auth/routes'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)

app.use(errorHandler)

export default app
