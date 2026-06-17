import { prisma } from '../../shared/prisma'
import { CreateAdminDTO } from './admin.types'

export async function findByCodFuncionario(cod_funcionario: string) {
  return prisma.funcionario.findUnique({ where: { cod_funcionario } })
}

export async function createAdmin(data: CreateAdminDTO, hashedSenha: string) {
  return prisma.funcionario.create({
    data: {
      cod_funcionario: data.cod_funcionario,
      nome: data.nome,
      cargo: data.cargo,
      senha: hashedSenha,
    },
  })
}
