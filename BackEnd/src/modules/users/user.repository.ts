import { prisma } from '../../shared/prisma'
import { CreateUserDTO, UpdateUserDTO } from './user.types'

export async function findById(id: bigint) {
  return prisma.usuario.findUnique({
    where: { id },
    include: { endereco: true },
  })
}

export async function findByEmail(email: string) {
  return prisma.usuario.findUnique({ where: { email } })
}

export async function findByCpf(cpf: string) {
  return prisma.usuario.findUnique({ where: { cpf } })
}

export async function createUser(data: CreateUserDTO, hashedSenha: string) {
  return prisma.$transaction(async (tx) => {
    const endereco = await tx.endereco.create({ data: data.endereco })

    return tx.usuario.create({
      data: {
        nome: data.nome,
        sobrenome: data.sobrenome,
        cpf: data.cpf,
        telefone: data.telefone,
        email: data.email,
        senha: hashedSenha,
        contato_emergencia: data.contato_emergencia,
        telefone_emergencia: data.telefone_emergencia,
        endereco_id: endereco.id,
      },
      include: { endereco: true },
    })
  })
}

export async function updateUser(id: bigint, data: UpdateUserDTO) {
  const { endereco, ...usuarioData } = data

  return prisma.$transaction(async (tx) => {
    if (endereco) {
      const usuario = await tx.usuario.findUnique({ where: { id } })
      await tx.endereco.update({
        where: { id: usuario!.endereco_id },
        data: endereco,
      })
    }

    return tx.usuario.update({
      where: { id },
      data: usuarioData,
      include: { endereco: true },
    })
  })
}

export async function deleteUser(id: bigint) {
  return prisma.usuario.delete({ where: { id } })
}
