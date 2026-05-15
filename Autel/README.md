# Autel Pet Hotel

> Aplicativo mobile de hospedagem para pets — desenvolvido com **React Native** e **Expo SDK 54**

---

## Sobre o Projeto

O **Autel Pet Hotel** é um app mobile completo para gerenciamento de hospedagem de animais de estimação. Tutores cadastram seus pets, fazem reservas e acompanham estadias pelo celular. Administradores gerenciam clientes, pets, reservas e planos diretamente pelo app.

### Funcionalidades — Cliente

- Autenticação por e-mail (sem senha)
- Cadastro de pets com informações detalhadas de saúde e comportamento
- Reservas com cálculo automático de valor e vagas disponíveis em tempo real
- Escolha de plano de acomodação e preferência de alimentação
- Gestão de reservas — editar datas, tipo de acomodação e cancelar (multa de 30% se menos de 7 dias)
- Histórico de hospedagens

### Funcionalidades — Administrador

- Painel com estatísticas: usuários, pets, reservas ativas, canceladas, planos e receita total
- Gerenciamento de usuários, pets e reservas (visualizar e remover)
- **Cadastro de clientes** diretamente pelo app (aba Cadastro)
- **Cadastro de pets** para clientes já existentes, atribuindo ao tutor selecionado
- **Planos dinâmicos** — adicionar, editar (nome, descrição e preço) e remover planos de hospedagem
- **Capacidade do hotel** — alterar o número total de vagas disponíveis
- Visão completa de todas as reservas com nome do tutor em destaque
- Navegação dedicada: abas Hotel, Reservas, Cadastro e Admin (sem aba Início)

### Persistência

Todos os dados (usuários, pets, reservas, planos e vagas) são salvos localmente via **AsyncStorage**, persistindo entre sessões.

---

## Stack

| Tecnologia | Versão |
|---|---|
| Expo SDK | 54 |
| Expo Router | 6 |
| React | 19.1 |
| React Native | 0.81.5 |
| TypeScript | 5.x |
| AsyncStorage | 2.2.0 |

---

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- App **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 1. Clone o repositório

```bash
git clone https://github.com/Equipe-Autel/AUTEL_PI.git
cd AUTEL_PI/Autel
```

### 2. Instale as dependências

```bash
npm install --legacy-peer-deps
```

### 3. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

---

## Rodando no Dispositivo

Após rodar `npx expo start`, um QR code aparecerá no terminal.

**Celular físico (recomendado)**
1. Abra o app **Expo Go** no seu celular
2. Escaneie o QR code exibido no terminal

**Emulador Android**
Pressione `A` no terminal com o emulador aberto.
> Recomendado: AVD com API 34 ou 35 (Android 14/15).

**Simulador iOS** *(apenas macOS)*
Pressione `I` no terminal com o Xcode instalado.

---

## Usuários de Teste

| Tipo | E-mail |
|---|---|
| Administrador | `admin@autel.com` |
| Usuário comum | `joao@email.com` |

> Basta digitar o e-mail na tela de login — sem senha.

---

## Estrutura do Projeto

```
Autel/
├── app/
│   ├── _layout.tsx                 # Layout raiz (providers)
│   ├── (tabs)/                     # Navegação por abas
│   │   ├── _layout.tsx             # Configuração das abas e header
│   │   ├── index.tsx               # Home (oculta para admin)
│   │   ├── hotel.tsx               # Fazer reserva
│   │   ├── minhas-reservas.tsx     # Gerenciar reservas (admin vê todas)
│   │   ├── meus-pets.tsx           # Pets do usuário (oculta para admin)
│   │   ├── cadastro.tsx            # Cadastro de clientes (apenas admin)
│   │   ├── admin.tsx               # Painel administrativo (apenas admin)
│   │   ├── quem-somos.tsx          # Página da equipe
│   │   └── contatos.tsx            # Página de contato
│   ├── login.tsx
│   ├── cadastro-usuario.tsx
│   ├── cadastro-pet.tsx
│   └── editar-pet/
│       └── [id].tsx                # Edição de pet por ID
│
├── src/
│   ├── components/ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── DatePicker.tsx
│   │   └── Toast.tsx
│   ├── context/
│   │   └── AppContext.tsx          # Estado global (Context API)
│   ├── constants/
│   │   └── theme.ts                # Cores e espaçamentos
│   ├── types/
│   │   └── index.ts                # Interfaces TypeScript
│   └── utils/
│       └── storage.ts              # Wrappers AsyncStorage
│
├── app.json
├── babel.config.js
└── tsconfig.json
```

---

## Design

| Token | Valor |
|---|---|
| Cor principal (teal) | `#2D7A7B` |
| Cor secundária (laranja) | `#E67E4D` |
| Fundo (bege) | `#F5F5F0` |

---

## Licença

Distribuído sob a licença MIT.
