# 1. Gera e aplica a migration
npx prisma migrate dev --name descricao_da_mudanca

# 2. Atualiza o Prisma Client
npx prisma generate