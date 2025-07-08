# Velocity4

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Funcionalidades

### **Gestão de Alojamentos**
- Cadastro de propriedades e repúblicas
- Listagem e visualização de alojamentos
- Validação de endereços via CEP
- Interface para gerenciamento

### **Gestão de Funcionários**
- Cadastro de funcionários
- Validação de CPF
- Formulários estruturados e validados

### **Gestão de Veículos**
- Cadastro de frota
- Suporte a veículos de passageiros e carga
- Validação de placas
- Categorização por tipo de veículo

### **Interface Moderna**
- Design responsivo e moderno
- Componentes reutilizáveis com shadcn/ui

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15.3.3** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **@hookform/resolvers** - Integração Zod + React Hook Form

### UI/UX
- **shadcn/ui** - Sistema de componentes
- **Lucide React** - Ícones modernos
- **Sonner** - Sistema de notificações toast
- 
## 📁 Estrutura do Projeto

```
Velocity4/
├── app/                          # App Router (Next.js 15)
│   ├── alojamentos/             # Módulo de Alojamentos
│   │   ├── page.tsx             # Página principal
│   │   ├── RepublicForm.tsx     # Formulário de cadastro
│   │   └── RepublicList.tsx     # Listagem de alojamentos
│   ├── funcionarios/            # Módulo de Funcionários
│   │   ├── page.tsx             # Página principal
│   │   └── RegisterEmployees.tsx # Cadastro de funcionários
│   ├── veiculos/                # Módulo de Veículos
│   │   ├── page.tsx             # Página principal
│   │   └── RegisterVehicles.tsx # Cadastro de veículos
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard
│   └── globals.css              # Estilos globais
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes shadcn/ui
│   └── Navbar.tsx               # Barra de navegação
├── hooks/                       # Custom Hooks
├── lib/                         # Utilitários
├── utils/                       # Serviços e validadores
│   ├── cep-service.ts           # Serviço de CEP
│   └── cpf-validator.ts         # Validador de CPF
└── public/                      # Arquivos estáticos
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm, yarn ou pnpm

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/velocity4.git
cd velocity4
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3300
```

### 4. Execute o projeto
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

## 📋 Scripts Disponíveis

```json
{
  "dev": "next dev",           # Inicia o servidor de desenvolvimento
  "build": "next build",       # Gera build de produção
  "start": "next start",       # Inicia servidor de produção
  "lint": "next lint"          # Executa linting do código
}
```
