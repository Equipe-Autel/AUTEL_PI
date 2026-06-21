import { Request, Response, NextFunction } from 'express'
import { PetService } from './pet.service'

export class PetController {
  private petService: PetService

  constructor() {
    this.petService = new PetService()
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id 
      const petData = { ...req.body, usuario_id: userId }
      
      const pet = await this.petService.createPet(petData)
      return res.status(201).json(pet)
    } catch (error) {
      next(error)
    }
  }

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.id

      const petId = Array.isArray(id) ? id[0] : id

      const pet = await this.petService.getPetById(petId, userId)
      return res.status(200).json(pet)
    } catch (error) {
      next(error)
    }
  }

  listMyPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id
      const role = (req as any).user.role
      const pets = role === 'ADMIN'
        ? await this.petService.getAllPets()
        : await this.petService.getPetsByUser(userId)
      return res.status(200).json(pets)
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.id

      const petId = Array.isArray(id) ? id[0] : id

      const pet = await this.petService.updatePet(petId, userId, req.body)
      return res.status(200).json(pet)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const userId = (req as any).user.id

      const petId = Array.isArray(id) ? id[0] : id

      await this.petService.deletePet(petId, userId)
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}