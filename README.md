<div align="center">

<img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" />

<br/>
<br/>

# 🐾 Autel
### Hotel para Pets

*Um espaço pensado com carinho para cuidar do seu melhor amigo.*

</div>

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
cd Autel
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
Autel/
├── .expo/
│   ├── devices.json
│   ├── README.md
│   └── types/
│       └── router.d.ts
├── app/
│   ├── +not-found.tsx
│   ├── _layout.tsx
│   ├── admin.tsx
│   ├── cadastro-pet.tsx
│   ├── cadastro-usuario.tsx
│   ├── contatos.tsx
│   ├── login.tsx
│   ├── quem-somos.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── hotel.tsx
│       ├── index.tsx
│       └── minhas-reservas.tsx
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── ui/
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── alert.tsx
│   │   │       ├── aspect-ratio.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── carousel.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── command.tsx
│   │   │       ├── context-menu.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── drawer.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── form.tsx
│   │   │       ├── hover-card.tsx
│   │   │       ├── input-otp.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── menubar.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── radio-group.tsx
│   │   │       ├── resizable.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── slider.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── toggle-group.tsx
│   │   │       ├── toggle.tsx
│   │   │       ├── tooltip.tsx
│   │   │       ├── use-mobile.ts
│   │   │       └── utils.ts
│   │   ├── context/
│   │   │   └── AppContext.tsx
│   │   ├── pages/
│   │   │   ├── Admin.tsx
│   │   │   ├── CadastroPet.tsx
│   │   │   ├── CadastroUsuario.tsx
│   │   │   ├── Contatos.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Hotel.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MinhasReservas.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── QuemSomos.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── storage.ts
│   ├── components/
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── DatePicker.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Toast.tsx
│   ├── constants/
│   │   └── theme.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── main.tsx
│   ├── styles/
│   │   ├── fonts.css
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── storage.ts
├── app.json
├── ATTRIBUTIONS.md
├── babel.config.js
├── expo-env.d.ts
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Design

| Token | Valor |
|---|---|
| Cor principal (teal) | `#2D7A7B` |
| Cor secundária (laranja) | `#E67E4D` |
| Fundo (bege) | `#F5F5F0` |


---


## 👥 Equipe

| Nome | Função |
|------|--------|
| Ian Melo | ... |
| Caroline Lopes | ... |
| Amanda Dahm | ... |
| Antônio Vieira | ... |


---

<div align="center">
  Feito com 🐾 pela equipe Autel
</div>
