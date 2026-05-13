-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "autel";

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionario" (
    "id" SERIAL NOT NULL,
    "cod_funcionario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,

    CONSTRAINT "funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet" (
    "id" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "peso" DECIMAL(5,2) NOT NULL,
    "porte" CHAR(1) NOT NULL,
    "sexo" CHAR(1) NOT NULL,
    "naturalidade" TEXT NOT NULL,
    "comportamento" TEXT NOT NULL,
    "brincadeiras_favoritas" TEXT,
    "obs_saude" TEXT NOT NULL,
    "castrado" CHAR(1) NOT NULL,
    "usuario_id" BIGINT NOT NULL,

    CONSTRAINT "pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plano" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor_diaria" DECIMAL(5,2) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" BIGSERIAL NOT NULL,
    "cod_reserva" TEXT NOT NULL,
    "data_reserva" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkin" TIMESTAMP(6) NOT NULL,
    "checkout" TIMESTAMP(6) NOT NULL,
    "data_horario_entrada" TIME(6),
    "data_horario_saida" TIME(6),
    "status_reserva" TEXT NOT NULL,
    "status_pagamento" TEXT NOT NULL,
    "observacoes" TEXT,
    "alimentacao" TEXT NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "pet_id" BIGINT NOT NULL,
    "funcionario_id" INTEGER,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" BIGSERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "telefone" CHAR(11) NOT NULL,
    "email" TEXT NOT NULL,
    "contato_emergencia" TEXT,
    "telefone_emergencia" VARCHAR(11),
    "endereco_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reserva_cod_reserva_key" ON "reserva"("cod_reserva");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "pet" ADD CONSTRAINT "fk_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "fk_funcionario" FOREIGN KEY ("funcionario_id") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "fk_pet" FOREIGN KEY ("pet_id") REFERENCES "pet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "fk_plano" FOREIGN KEY ("plano_id") REFERENCES "plano"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "fk_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_endereco" FOREIGN KEY ("endereco_id") REFERENCES "endereco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;