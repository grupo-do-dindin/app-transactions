# DinDin — Transactions (Zona do Dashboard)

Uma aplicação de controle financeiro pessoal construída com Next.js, Tailwind CSS. O projeto simula um pequeno painel de transações onde o usuário pode registar receitas e despesas, visualizar o saldo total e consultar o histórico de transações.

Repositório: [`grupo-do-dindin/app-transactions`](https://github.com/grupo-do-dindin/app-transactions)

## Papel na arquitetura de micro-frontends

Esta zona não é acessada diretamente pelo usuário: ela é servida por trás do **root** (app shell), que reescreve `/transactions` e `/transactions/*` para esta aplicação (ver `root/next.config.ts` e a variável `TRANSACTIONS_ZONE_URL`). Por isso o `next.config.ts` local define `basePath: "/transactions"`.

Diferente de `root` e `login`, esta zona é **totalmente independente**: tem seu próprio `package.json`/lockfile e não depende do pacote `@dindin/design-system` — usa seus próprios componentes, Tailwind e `next-themes` diretamente.

O acesso à zona é protegido pelo middleware `proxy.ts` do root: sem o cookie `dindin_session`, o usuário é redirecionado para `/login` antes de chegar aqui.

- **Rodando via Docker Compose (orquestrado pelo root)**: o Next.js sobe na porta `3002` (interna à rede do compose) e o `json-server` na `3333` (exposta ao host).
- **Rodando isoladamente (fora do compose)**: os comandos abaixo (`npm run dev`, `npm run dev:all`) sobem o Next.js na porta padrão `3000` e o `json-server` na `3333`, sem `basePath`, para permitir desenvolver/testar esta zona sozinha.

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
├── Dockerfile                # imagem dev-only, independente (seu próprio package.json/lockfile)
├── next.config.ts            # basePath "/transactions" (usado quando orquestrado pelo root)
├── package.json               # dependências e scripts do projeto
├── server.json                 # dados do json-server e API mock de transações
└── src/
    ├── stories/                # histórias do Storybook para os componentes principais
    └── app/
        ├── page.tsx             # entry point da rota: renderiza o componente Dashboard
        ├── globals.css          # estilos globais da aplicação
        ├── page.module.css      # estilos específicos da página principal
        ├── layout.tsx           # layout raiz: fonte Roboto, ThemeProvider, LayoutBase
        ├── lib/
        │   └── axios.ts          # instância Axios para comunicação com a API mock
        ├── hooks/
        │   └── useTransactions.ts   # hook: fetch/create/edit/delete de transações via API mock
        ├── store/
        │   ├── useTransactionsStore.ts  # store Zustand: transações, erro e loading
        │   └── useModalStore.ts          # store Zustand: controla abertura/edição do modal
        ├── types/
        │   └── transaction.ts    # tipos TypeScript para transações
        ├── components/
        │   ├── Dashboard.tsx          # componente client: conecta hooks/stores à DashboardView
        │   ├── AccountBalance.tsx     # painel de entradas, saídas e saldo total
        │   ├── AddTransactionForm.tsx # formulário (modal) para adicionar/editar transação
        │   ├── TransactionList.tsx    # lista de transações exibidas no app
        │   ├── Header/
        │   │   ├── Header.tsx        # cabeçalho principal da aplicação
        │   │   └── ThemeToggle.tsx   # controle de tema claro/escuro
        │   └── Footer/
        │       └── Footer.tsx       # rodapé da aplicação
        └── layout/
            └── LayoutBase/
                ├── LayoutBase.tsx   # estrutura de layout base (Header + conteúdo + Footer)
                └── styles.module.css # estilos do layout base
```

`page.tsx` apenas renderiza `Dashboard` (`components/Dashboard.tsx`), que busca as transações via `useTransactions` e controla o estado do modal de adicionar/editar via `useModalStore`, delegando a apresentação para `DashboardView` (dentro de `components/Dashboard.tsx`).

## API mock

A API local é servida pelo `json-server` usando `server.json`. Ele expoe `/transactions` onde:

- `GET /transactions`: lista todas as transaçoes;
- `POST /transactions`: cria uma nova transaçaõ;
- `PATCH /transactions/:id`: altera a transação com id especifico;
- `DELETE /transactions/:id`: Remove a transação com id especifico;

## Uso

Rodando isoladamente (fora do Docker Compose):

1. Abra `http://localhost:3000` no navegador
2. Use o formulário de "Nova transação" para adicionar receita ou despesa
3. Veja o saldo atualizado automaticamente no painel superior
4. Verifique o histórico de transações na lista abaixo

Rodando via Docker Compose (ver [docker-compose.yml na raiz do monorepo](../README.md)), esta zona não é acessada diretamente — o acesso é sempre através do root, em `http://localhost:3000/transactions`.

## Sobre

Este é o primeiro projeto do curso de pós graduação em Frontend Engineering da FIAP desenvolvido pelos pós-graduandos Camila, Lysia, Mateus, Matheus e Victor
