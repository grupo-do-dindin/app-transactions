# DinDin

Uma aplicação de controle financeiro pessoal construída com Next.js, Tailwind CSS. O projeto simula um pequeno painel de transações onde o usuário pode registar receitas e despesas, visualizar o saldo total e consultar o histórico de transações.

## Recursos

- Exibição de saldo total, entradas e saidas
- Cadastro de novas transações com descrição, categoria, valor e tipo (receita/despesa)
- Lista de transações ordenadas
- Tema claro/escuro (via `next-themes`)
- Backend simulado (mock) com `json-server` para armazenar transações localmente

## Tecnologias

- TypeScript
- Next.js 16
- React 19
- Tailwind CSS 4
- Axios
- Storybook

## Pré-requisitos

- Node.js 22+
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lysialeao/tech-challenge
cd challenge
```

2. Instale as dependencias:

```bash
npm install
```

ou

```bash
yarn install
```

## Execução

### Iniciar o frontend e o backend (mock) juntos

```bash
npm run dev:all
```

Isso executa:

- `next dev` para o frontend em `http://localhost:3000`
- `json-server --watch server.json --port 3333` para a API mock em `http://localhost:3333`

### Executar apenas o frontend

```bash
npm run dev
```

### Executar apenas o mock

```bash
npm run dev:server
```

## Scripts disponiveis

- `npm run dev` - inicia apenas o front
- `npm run dev:server` - inicia apenas o servidor `json-server`
- `npm run dev:all` - inicia frontend e backend juntos
- `npm run build` - cria versão de produção do Next.js
- `npm run start` - inicia o servidor Next.js em modo de produção
- `npm run lint` - executa o ESLint
- `npm run storybook` - executa o Storybook com documentação dos componentes e páginas

## Estrutura do projeto

```text
.
├── README.md                # documentação do projeto e instruções de uso
├── package.json             # dependências e scripts do projeto
├── server.json              # dados do json-server e API mock de transações
└── src/app/
    ├── page.tsx             # página principal que carrega transações e monta a UI
    ├── globals.css          # estilos globais da aplicação
    ├── page.module.css      # estilos específicos da página principal
    ├── lib/
    │   └── axios.ts         # instância Axios para comunicação com a API mock
    ├── hooks/
    │   └── useTransactions.ts  # hook para buscar, criar, editar e excluir transações
    ├── store/
    │   └── useTransactionsStore.ts  # store Zustand que guarda transações, erro e loading
    ├── types/
    │   └── transaction.ts   # tipos TypeScript para transações
    ├── components/
    │   ├── AccountBalance.tsx    # painel de entradas, saídas e saldo total
    │   ├── AddTransactionForm.tsx # formulário para adicionar nova transação
    │   ├── TransactionList.tsx    # lista de transações exibidas no app
    │   ├── Header/
    │   │   ├── Header.tsx        # cabeçalho principal da aplicação
    │   │   └── ThemeToggle.tsx   # controle de tema claro/escuro
    │   └── Footer/
    │       └── Footer.tsx       # rodapé da aplicação
    └── layout/
        └── LayoutBase/
            ├── LayoutBase.tsx   # estrutura de layout base usada no app
            └── styles.module.css # estilos do layout base
```

## API mock

A API local é servida pelo `json-server` usando `server.json`. Ele expoe `/transactions` onde:

- `GET /transactions`: lista todas as transaçoes;
- `POST /transactions`: cria uma nova transaçaõ;
- `PATCH /transactions/:id`: altera a transação com id especifico;
- `DELETE /transactions/:id`: Remove a transação com id especifico;

## Uso

1. Abra `http://localhost:3000` no navegador
2. Use o formulário de "Nova transação" para adicionar receita ou despesa
3. Veja o saldo atualizado automaticamente no painel superior
4. Verifique o histórico de transações na lista abaixo

## Sobre

Este é o primeiro projeto do curso de pós graduação em Frontend Engineering da FIAP desenvolvido pelos pós-graduandos Camila, Lysia, Mateus, Matheus e Victor
