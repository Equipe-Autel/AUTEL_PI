import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler'
import { authenticate } from '../../shared/middlewares/authMiddleware'
import {
  createUserController,
  deleteUserController,
  getUserController,
  updateUserController,
} from './user.controller'

const router = Router()

router.post('/', asyncHandler(createUserController))
router.get('/:id', authenticate, asyncHandler(getUserController))
router.put('/:id', authenticate, asyncHandler(updateUserController))
router.delete('/:id', authenticate, asyncHandler(deleteUserController))

export default router
