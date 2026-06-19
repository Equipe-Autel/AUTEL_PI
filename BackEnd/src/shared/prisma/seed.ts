import 'dotenv/config'
import { prisma } from '../prisma'
import bcrypt from 'bcrypt'

async function main() {
  const codFunc = 'ADM001';
  const senha = 'senha_admin';
  const nome = 'Administrador';
  const cargo = 'Gerente';

  console.log(`Verificando se a conta de admin (${codFunc}) existe...`);
  
  const existing = await prisma.funcionario.findUnique({
    where: { cod_funcionario: codFunc }
  });

  if (existing) {
    console.log(`Conta de admin ${codFunc} já existe.`);
    return;
  }

  console.log(`Criptografando a senha...`);
  const passwordHash = await bcrypt.hash(senha, 10);

  console.log(`Criando a conta de admin...`);
  const created = await prisma.funcionario.create({
    data: {
      cod_funcionario: codFunc,
      senha: passwordHash,
      nome,
      cargo
    }
  });

  console.log(`Conta de admin criada com sucesso!`, {
    id: created.id,
    cod_funcionario: created.cod_funcionario,
    nome: created.nome,
    cargo: created.cargo
  });
}

main()
  .catch((e) => {
    console.error('Erro ao criar a conta de admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
