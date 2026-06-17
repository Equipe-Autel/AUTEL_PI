import { Request, Response } from 'express'
import * as userService from './user.service'

export async function createUserController(req: Request, res: Response) {
  const user = await userService.createUser(req.body)
  res.status(201).json(user)
}

export async function getUserController(req: Request, res: Response) {
  const id = String(req.params.id)
  const user = await userService.getUserById(id, req.user!.id, req.user!.role)
  res.status(200).json(user)
}

export async function updateUserController(req: Request, res: Response) {
  const id = String(req.params.id)
  const user = await userService.updateUser(id, req.body, req.user!.id)
  res.status(200).json(user)
}

export async function deleteUserController(req: Request, res: Response) {
  const id = String(req.params.id)
  await userService.deleteUser(id, req.user!.id, req.user!.role)
  res.status(204).send()
}
