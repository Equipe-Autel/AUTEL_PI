/*
  Warnings:

  - Added the required column `senha` to the `funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "funcionario" ADD COLUMN     "senha" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "senha" TEXT NOT NULL;
