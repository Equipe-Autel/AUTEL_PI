# Autel - Sistema de Reserva para Hotel Pet 🐾

Este repositório contém a solução completa para o **Autel**, um sistema de reservas de hospedagem voltado para hotéis pet. A aplicação é dividida em duas partes principais:
1. **BackEnd**: API desenvolvida em Node.js com Express, Prisma ORM e banco de dados PostgreSQL.
2. **Autel (FrontEnd/App)**: Aplicativo mobile multiplataforma desenvolvido com React Native (Expo) e TypeScript.

---

## 🛠️ Pré-requisitos
Antes de começar, verifique se você possui as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:
* **Node.js** (versão 18 ou superior recomendada)
* **npm** ou **yarn**
* **PostgreSQL** (banco de dados rodando localmente ou em nuvem)
* **Expo Go** instalado no seu dispositivo móvel (Android/iOS) para testar o app físico, ou um emulador configurado.

---

## 🗄️ 1. Configuração e Inicialização do BackEnd

O backend gerencia os usuários, pets, reservas, acomodações (planos) e vagas do hotel pet.

### Passos para rodar:
1. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd BackEnd
   ```

2. Instale todas as dependências do projeto:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   * No diretório `BackEnd`, crie ou edite o arquivo `.env` com a seguinte estrutura:
     ```env
     PORT=3000
     DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/autel?schema=public"
     JWT_SECRET="sua_chave_secreta_jwt_aqui"
     ```
   * Substitua `USUARIO`, `SENHA` e o nome do banco de dados (`autel`) pelas suas credenciais locais do PostgreSQL.

4. Gere o client do Prisma ORM:
   ```bash
   npx prisma generate
   ```

5. Execute as migrations para criar as tabelas no banco de dados (caso esteja configurando um banco do zero):
   ```bash
   npx prisma migrate dev
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   * O servidor iniciará por padrão na porta **3000** (`http://localhost:3000`).

---

## 📱 2. Configuração e Inicialização do App (FrontEnd)

O aplicativo mobile permite que os tutores cadastrem seus pets, criem e gerenciem reservas de diárias, e possibilita que administradores controlem todo o hotel através de um painel gerencial.

### Passos para rodar:
1. Abra um novo terminal e navegue até a pasta do aplicativo:
   ```bash
   cd Autel
   ```

2. Instale as dependências do aplicativo:
   ```bash
   npm install
   ```

3. Configure o endereço da API no app:
   * O aplicativo utiliza um arquivo de configuração para saber onde o backend está rodando. Verifique o arquivo `src/services/api.ts` e certifique-se de que a `API_URL` aponta para o IP correto da sua máquina na rede local (essencial para testar em dispositivo móvel físico) ou use `http://10.0.2.2:3000` caso utilize o emulador do Android.

4. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

5. Abrindo o aplicativo:
   * **No celular físico:** Abra a câmera do seu celular ou o aplicativo **Expo Go** e escaneie o QR Code gerado no terminal. Ambos os dispositivos (computador e celular) devem estar conectados na **mesma rede Wi-Fi**.
   * **No emulador Android:** Pressione `a` no terminal.
   * **No simulador iOS:** Pressione `i` no terminal.

---


