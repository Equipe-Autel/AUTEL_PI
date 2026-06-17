import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler'
import { authenticate } from '../../shared/middlewares/authMiddleware'
import { requireAdmin } from '../../shared/middlewares/requireAdmin'
import { createAdminController } from './admin.controller'

const router = Router()

router.post('/', authenticate, requireAdmin, asyncHandler(createAdminController))

export default router
