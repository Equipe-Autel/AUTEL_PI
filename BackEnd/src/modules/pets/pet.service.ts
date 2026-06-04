import { PetRepository } from './pet.repository'
import { CreatePetDTO, UpdatePetDTO } from './pet.types'
import { NotFoundError, ForbiddenError } from '../../shared/errors/appError'

export class PetService {
  private petRepository: PetRepository

  constructor() {
    this.petRepository = new PetRepository()
  }

  private serializePet(pet: any) {
    return {
      ...pet,
      id: pet.id.toString(),
      usuario_id: pet.usuario_id.toString(),
      peso: Number(pet.peso), 
    }
  }

  async createPet(data: CreatePetDTO) {
    const pet = await this.petRepository.create(data)
    return this.serializePet(pet)
  }

  async getPetById(id: string, authenticatedUserId: string) {
    const pet = await this.petRepository.findById(id)

    if (!pet) {
      throw new NotFoundError('Pet não encontrado')
    }

    if (pet.usuario_id.toString() !== authenticatedUserId.toString()) {
      throw new ForbiddenError('Você não tem permissão para acessar este pet')
    }

    return this.serializePet(pet)
  }

  async getPetsByUser(userId: string) {
    const pets = await this.petRepository.findByUserId(userId)
    return pets.map((pet: any) => this.serializePet(pet))
  }

  async updatePet(id: string, userId: string, data: UpdatePetDTO) {
    const pet = await this.petRepository.findById(id)

    if (!pet) {
      throw new NotFoundError('Pet não encontrado')
    }

    if (pet.usuario_id.toString() !== userId.toString()) {
      throw new ForbiddenError('Você não tem permissão para alterar este pet')
    }

    const updatedPet = await this.petRepository.update(id, data)
    return this.serializePet(updatedPet)
  }

  async deletePet(id: string, userId: string) {
    const pet = await this.petRepository.findById(id)

    if (!pet) {
      throw new NotFoundError('Pet não encontrado')
    }

    if (pet.usuario_id.toString() !== userId.toString()) {
      throw new ForbiddenError('Você não tem permissão para deletar este pet')
    }

    await this.petRepository.delete(id)
  }
}