import { Router, type Request, type Response } from 'express'
import { adminLogin, userLogin } from './service'
import { asyncHandler } from '../../shared/middlewares/asyncHandler'

const router = Router()

// Rota para login de usuário
router.post('/user/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, senha } = req.body

  const resultLogin = await userLogin(email, senha)

  res.status(200).json(resultLogin)
}))

// Rota para login de administrador
router.post(('/admin/login'), asyncHandler(async (req: Request, res: Response) => {
    const { codFunc, senha } = req.body

    const resultLogin = await adminLogin(codFunc, senha)

    res.status(200).json(resultLogin)
}))




export default router
