import express from 'express'
import { errorHandler } from './shared/middlewares/erroHandler'
import authRoutes from './modules/auth/routes'
import userRoutes from './modules/users/user.routes'
import adminRoutes from './modules/admin/admin.routes'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)

app.use(errorHandler)

export default app
