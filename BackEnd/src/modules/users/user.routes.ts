import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler'
import { authenticate } from '../../shared/middlewares/authMiddleware'
import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
  createAdminController,
} from './user.controller'

const router = Router()

router.post('/', asyncHandler(createUserController))
router.post('/admin', authenticate, asyncHandler(createAdminController))
router.get('/:id', authenticate, asyncHandler(getUserController))
router.put('/:id', authenticate, asyncHandler(updateUserController))
router.delete('/:id', authenticate, asyncHandler(deleteUserController))

export default router
