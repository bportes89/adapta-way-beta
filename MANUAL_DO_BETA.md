# Manual do Projeto Beta - Adapta Way

## 1. Visão Geral
Este documento acompanha a entrega da versão **Beta (MVP)** da plataforma Adapta Way.
O sistema foi desenvolvido para validar o modelo de negócio, fluxo de tokenização e usabilidade.

**Status da Versão:** `BETA 1.0`
**Ambiente:** Teste / Homologação

---

## 2. Escopo Entregue (Checklist)

### ✅ Módulo Financeiro & Wallet
- [x] **AdaptaCoin**: Moeda interna operando como crédito digital.
- [x] **Depósitos (On-ramp)**: Simulação de PIX com conversão automática (1:1).
- [x] **Saques (Off-ramp)**: Solicitação de saque PIX com fluxo de aprovação administrativa.
- [x] **Transferências**: Envio de valores entre usuários.

### ✅ Tokenização & Ativos
- [x] **Gestão de Ativos**: Criação de ativos (Empresas, Projetos) pelo Admin.
- [x] **Compra de Cotas**: Usuários podem comprar frações de ativos usando AdaptaCoin.
- [x] **Blockchain Interna**: Registro imutável de transações (Simulação PoW).
- [x] **NFTs**: Emissão de certificados digitais de propriedade.

### ✅ Segurança & Acesso
- [x] **Autenticação**: Login seguro com JWT.
- [x] **2FA (Dois Fatores)**: Integração com Google Authenticator.
- [x] **Painel Administrativo**: Gestão de usuários, ativos e aprovações.

---

## 3. Guia de Testes para o Cliente

### Passo 1: Cadastro e Acesso
1. Acesse a rota `/register`.
2. Crie uma conta (Pessoa Física ou Jurídica).
3. Faça login em `/login`.

### Passo 2: Simular Depósito
1. No Dashboard, clique em **"Deposit"**.
2. Insira um valor (ex: R$ 10.000,00).
3. O sistema simulará a confirmação bancária e creditará **10.000 AdaptaCoins**.

### Passo 3: Comprar Ativos
1. Vá até a aba **"Assets"**.
2. Escolha um ativo disponível.
3. Compre cotas usando seu saldo.
4. Verifique em **"My Assets"** suas novas cotas.

### Passo 4: Solicitar Saque
1. No Dashboard, clique em **"Withdraw"**.
2. Digite sua chave PIX e o valor.
3. O saldo será bloqueado aguardando aprovação do Admin.

---

## 4. Notas Técnicas para a Equipe de TI

### Requisitos de Servidor
- **Node.js**: v18 ou superior.
- **Banco de Dados**: MySQL, MariaDB ou SQLite (Configuração automática).
- **Variáveis de Ambiente**: Configurar arquivo `.env` na raiz do backend.

### Deploy
O projeto está pronto para deploy em:
- **cPanel** (via Setup Node.js App).
- **VPS** (DigitalOcean, AWS, etc).
- **Vercel/Netlify** (apenas Frontend).

---

## 5. Limitações do Beta (Aviso Legal)
- **Dinheiro Fictício**: Todas as operações financeiras são simulações. Não há conexão real com bancos neste momento.
- **Blockchain Privada**: A rede blockchain roda internamente para fins de registro e auditoria, sem conexão com redes públicas (Ethereum/Polygon) nesta fase.
