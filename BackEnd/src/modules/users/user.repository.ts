import { prisma } from '../../shared/prisma'
import { CreateUserDTO, UpdateUserDTO, CreateAdminDTO } from './user.types'

export async function findById(id: bigint) {
  return prisma.usuario.findUnique({
    where: { id },
    include: { endereco: true },
  })
}

export async function findAll() {
  return prisma.usuario.findMany({
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
  return prisma.$transaction(async (tx) => {
    // 1. Delete associated reservations
    await tx.reserva.deleteMany({ where: { usuario_id: id } })
    // 2. Delete associated pets
    await tx.pet.deleteMany({ where: { usuario_id: id } })
    // 3. Find user to get address ID before deleting the user
    const user = await tx.usuario.findUnique({ where: { id } })
    if (user) {
      // 4. Delete the user
      await tx.usuario.delete({ where: { id } })
      // 5. Delete associated address
      await tx.endereco.delete({ where: { id: user.endereco_id } })
    }
  })
}

export async function findFuncionarioByCod(codFunc: string) {
  return prisma.funcionario.findUnique({ where: { cod_funcionario: codFunc } })
}

export async function createFuncionario(data: CreateAdminDTO, hashedSenha: string) {
  return prisma.funcionario.create({
    data: {
      cod_funcionario: data.cod_funcionario,
      senha: hashedSenha,
      nome: data.nome,
      cargo: data.cargo,
    },
  })
}
