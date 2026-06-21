import { Request, Response } from 'express'
import { userLogin, adminLogin } from './service'

export async function userLoginController(req: Request, res: Response) {
  const { email, senha } = req.body
  const result = await userLogin(email, senha)
  res.status(200).json(result)
}

export async function adminLoginController(req: Request, res: Response) {
  const { codFunc, senha } = req.body
  const result = await adminLogin(codFunc, senha)
  res.status(200).json(result)
}