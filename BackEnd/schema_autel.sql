CREATE SCHEMA IF NOT EXISTS autel;

-- Tabela de endereço
CREATE TABLE IF NOT EXISTS autel.endereco(
	id SERIAL PRIMARY KEY NOT NULL,
	logradouro TEXT NOT NULL,
	bairro TEXT NOT NULL,
	cidade TEXT NOT NULL,
	estado TEXT NOT NULL,
	numero TEXT,
	complemento TEXT
);

-- Tabela de usuário
CREATE TABLE IF NOT EXISTS autel.usuario(
	id BIGSERIAL PRIMARY KEY NOT NULL,
	nome TEXT NOT NULL,
	sobrenome TEXT NOT NULL,
	cpf CHAR(11) NOT NULL UNIQUE,
	telefone CHAR(11) NOT NULL,
	email TEXT NOT NULL UNIQUE,
	contato_emergencia TEXT,
	telefone_emergencia VARCHAR(11),
	endereco_id INT NOT NULL,
	CONSTRAINT fk_endereco FOREIGN KEY (endereco_id) REFERENCES autel.endereco(id)
);

-- Tabela de pet
CREATE TABLE IF NOT EXISTS autel.pet(
	id BIGSERIAL PRIMARY KEY NOT NULL,
	nome TEXT NOT NULL,
	especie TEXT NOT NULL CHECK (especie IN ('Cachorro', 'Gato')),
	raca TEXT NOT NULL,
	data_nascimento DATE NOT NULL,
	peso DECIMAL(5,2) NOT NULL,
	porte CHAR(1) NOT NULL CHECK (porte IN ('P', 'M', 'G')),
	sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
	naturalidade TEXT NOT NULL,
	comportamento TEXT NOT NULL,
	brincadeiras_favoritas TEXT,
	obs_saude TEXT NOT NULL,
	castrado CHAR(1) NOT NULL CHECK (castrado IN ('S', 'N')),
	usuario_id BIGINT NOT NULL,
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES autel.usuario(id)
);

-- Tabela de plano
CREATE TABLE IF NOT EXISTS autel.plano(
	id SERIAL PRIMARY KEY NOT NULL,
	nome TEXT NOT NULL,
	valor_diaria DECIMAL(5,2) NOT NULL,
	descricao TEXT NOT NULL
);

-- Tabela de funcionário
CREATE TABLE IF NOT EXISTS autel.funcionario(
	id SERIAL PRIMARY KEY NOT NULL,
	cod_funcionario TEXT NOT NULL, -- Definir regra de negócio para cod do funcionário
	nome TEXT NOT NULL,
	cargo TEXT NOT NULL -- Definir check de cargos
);

-- Tabela de reserva
CREATE TABLE IF NOT EXISTS autel.reserva(
	id BIGSERIAL PRIMARY KEY NOT NULL,
	cod_reserva TEXT NOT NULL UNIQUE, -- Adicionar regra de negócio futura
	data_reserva TIMESTAMP NOT NULL DEFAULT NOW(),
	checkin TIMESTAMP NOT NULL,
	checkout TIMESTAMP NOT NULL,
	data_horario_entrada TIME,
	data_horario_saida TIME,
	status_reserva TEXT NOT NULL, -- Adicionar check para definir status de reserva
	status_pagamento TEXT NOT NULL, -- Adicionar check para definir status de pagamento
	observacoes TEXT,
	alimentacao TEXT NOT NULL, 
	plano_id INT NOT NULL,
	usuario_id BIGINT NOT NULL,
	pet_id BIGINT NOT NULL,
	funcionario_id INT, -- Decidir se apenas funcionário vai fazer reservas
	CONSTRAINT fk_plano FOREIGN KEY (plano_id) REFERENCES autel.plano(id),
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES autel.usuario(id),
	CONSTRAINT fk_pet FOREIGN KEY (pet_id) REFERENCES autel.pet(id),
	CONSTRAINT fk_funcionario FOREIGN KEY (funcionario_id) REFERENCES autel.funcionario(id)
);