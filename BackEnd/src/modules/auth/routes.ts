import { Router } from 'express'
import { adminLoginController, userLoginController } from './controller'
import { asyncHandler } from '../../shared/middlewares/asyncHandler'

const router = Router()

router.post('/user/login', asyncHandler(userLoginController))
router.post('/admin/login', asyncHandler(adminLoginController))

export default router