/*
  Warnings:

  - A unique constraint covering the columns `[cod_funcionario]` on the table `funcionario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "funcionario_cod_funcionario_key" ON "funcionario"("cod_funcionario");
