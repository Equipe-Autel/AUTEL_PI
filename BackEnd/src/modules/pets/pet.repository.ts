import { prisma } from '../../shared/prisma'
import { CreatePetDTO, UpdatePetDTO } from './pet.types'

export class PetRepository {
  async create(data: CreatePetDTO) {
    return await prisma.pet.create({
      data: {
        nome: data.nome,
        especie: data.especie,
        raca: data.raca,
        data_nascimento: new Date(data.data_nascimento),
        peso: data.peso,
        porte: data.porte,
        sexo: data.sexo,
        naturalidade: data.naturalidade,
        comportamento: data.comportamento,
        brincadeiras_favoritas: data.brincadeiras_favoritas || null,
        obs_saude: data.obs_saude,
        castrado: data.castrado,
        usuario_id: BigInt(data.usuario_id),
      },
    })
  }

  async findById(id: string) {
    return await prisma.pet.findUnique({
      where: { id: BigInt(id) },
      include: { usuario: true },
    })
  }

  async findByUserId(usuario_id: string) {
    return await prisma.pet.findMany({
      where: { usuario_id: BigInt(usuario_id) },
    })
  }

  async findAll() {
    return await prisma.pet.findMany()
  }

  async update(id: string, data: UpdatePetDTO) {
    return await prisma.pet.update({
      where: { id: BigInt(id) },
      data: {
        ...data,
        data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : undefined,
      },
    })
  }

  async delete(id: string) {
    return await prisma.pet.delete({
      where: { id: BigInt(id) },
    })
  }
}