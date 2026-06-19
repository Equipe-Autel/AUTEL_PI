import express from 'express'
import { errorHandler } from './shared/middlewares/erroHandler'
import authRoutes from './modules/auth/routes'
import userRoutes from './modules/users/user.routes'
import { petRoutes } from './modules/pets/pet.routes'
import { planRoutes } from './modules/plans/plan.routes'
import { reservationRoutes } from './modules/reservations/reservation.routes'

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/pets', petRoutes)
app.use('/plans', planRoutes)
app.use('/reservations', reservationRoutes)

app.use(errorHandler)

export default app
