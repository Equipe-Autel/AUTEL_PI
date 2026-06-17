import { Request, Response } from 'express'
import * as adminService from './admin.service'

export async function createAdminController(req: Request, res: Response) {
  const admin = await adminService.createAdmin(req.body)
  res.status(201).json(admin)
}
