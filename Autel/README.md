# 🐾 Autel Pet Hotel

> Aplicativo mobile de hospedagem para pets — desenvolvido com **React Native** e **Expo SDK 54**

---

## ✨ Sobre o Projeto

O **Autel Pet Hotel** é um app mobile completo para gerenciamento de hospedagem de animais de estimação. Permite que tutores cadastrem seus pets, façam reservas, acompanhem estadias e gerenciem tudo pelo celular.

### Funcionalidades

- 🔐 **Autenticação** por e-mail (sem senha)
- 🐶 **Cadastro de pets** com informações detalhadas de saúde e comportamento
- 📅 **Reservas** com cálculo automático de valor e vagas disponíveis
- 🏨 **3 planos de acomodação** — Standard (R$ 80/dia), Premium (R$ 150/dia) e Luxo (R$ 250/dia)
- ✏️ **Gestão de reservas** — editar datas, tipo de acomodação e cancelar (com multa de 30% se < 7 dias)
- 🛡️ **Painel administrativo** com visão geral de usuários, pets e receita
- 💾 **Persistência local** via AsyncStorage

---

## 🛠 Stack

| Tecnologia | Versão |
|---|---|
| Expo SDK | 54 |
| Expo Router | 6 |
| React | 19.1 |
| React Native | 0.81.5 |
| TypeScript | 5.x |
| AsyncStorage | 2.2.0 |

---

## 🚀 Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- [npm](https://www.npmjs.com) 9 ou superior
- App **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

---

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/autel-pet-hotel.git
cd autel-pet-hotel
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

## 📱 Rodando no Dispositivo

Após rodar `npx expo start`, um QR code aparecerá no terminal.

### Celular físico (recomendado)
1. Abra o app **Expo Go** no seu celular
2. Escaneie o QR code exibido no terminal
3. O app carrega automaticamente 🎉

### Emulador Android
Pressione `A` no terminal com o emulador aberto.
> Recomendado: AVD com **API 34 ou 35** (Android 14/15). API 36 pode ser instável.

### Simulador iOS *(apenas macOS)*
Pressione `I` no terminal com o Xcode instalado.

---

## 👤 Usuários de Teste

O app vem com dois usuários pré-carregados:

| Tipo | E-mail |
|---|---|
| 🛡️ Administrador | `admin@autel.com` |
| 👤 Usuário comum | `joao@email.com` |

> Basta digitar o e-mail na tela de login — sem senha.

---

## 📁 Estrutura do Projeto

```
autel-pet-hotel/
├── app/                        # Rotas (Expo Router)
│   ├── _layout.tsx             # Layout raiz (providers)
│   ├── (tabs)/                 # Navegação por abas
│   │   ├── index.tsx           # Home
│   │   ├── hotel.tsx           # Fazer reserva
│   │   └── minhas-reservas.tsx # Gerenciar reservas
│   ├── login.tsx
│   ├── cadastro-usuario.tsx
│   ├── cadastro-pet.tsx
│   ├── admin.tsx
│   ├── quem-somos.tsx
│   └── contatos.tsx
│
├── src/
│   ├── components/ui/          # Componentes nativos
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── DatePicker.tsx
│   │   └── Toast.tsx
│   ├── context/
│   │   └── AppContext.tsx      # Estado global (Context API)
│   ├── constants/
│   │   └── theme.ts            # Cores e espaçamentos
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript
│   └── utils/
│       └── storage.ts          # Wrappers AsyncStorage
│
├── app.json                    # Configuração Expo
├── babel.config.js
└── tsconfig.json
```

---

## 🎨 Design

| Token | Valor |
|---|---|
| Cor principal (teal) | `#2D7A7B` |
| Cor secundária (laranja) | `#E67E4D` |
| Fundo (bege) | `#F5F5F0` |

---

## 📜 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
