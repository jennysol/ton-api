# Ton Products API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-orange)](https://aws.amazon.com/dynamodb/)
[![JWT](https://img.shields.io/badge/Auth-JWT-purple)](https://jwt.io/)

Uma API RESTful completa para gerenciamento de produtos e autenticação de usuários, construída com NestJS, DynamoDB e JWT.

## Demo Online

**[https://jenifer-ton-app.com/reference](https://jenifer-ton-app.com/reference)**

## Visão Geral

A **Ton API** oferece:

- **Sistema de Autenticação JWT** completo com signup/login
- **CRUD de Produtos** com paginação eficiente e validações robustas
- **Arquitetura em Camadas** (Repository, Service, Controller) com abstrações bem definidas
- **Documentação OpenAPI/Swagger** automática e interativa
- **Testes Automatizados** com alta cobertura (90%+)
- **CI/CD** com GitHub Actions
- **Deploy AWS** com Elastic Beanstalk e DynamoDB

## Documentação Completa

**[Ver Documentação Detalhada](https://jennysol.github.io/ton-api/)**

A documentação inclui:

- **[Instalação](https://jennysol.github.io/ton-api/installation.html)** - Setup completo, dependências e configuração do ambiente
- **[Arquitetura](https://jennysol.github.io/ton-api/architecture.html)** - Padrões de design, módulos e estrutura do sistema
- **[Autenticação](https://jennysol.github.io/ton-api/authentication.html)** - Sistema de auth, JWT, criptografia e segurança
- **[Produtos](https://jennysol.github.io/ton-api/products.html)** - CRUD completo, validações, paginação e exemplos
- **[Referência da API](https://jennysol.github.io/ton-api/api-reference.html)** - Todos os endpoints, exemplos de requests/responses

## Tecnologias

- **Backend**: NestJS 10+ + TypeScript 5+
- **Banco de Dados**: Amazon DynamoDB + ElectroDB
- **Autenticação**: JWT + bcrypt (com abstração via EncryptionService)
- **Validação**: class-validator + class-transformer
- **Documentação**: Swagger/OpenAPI + Scalar API Reference
- **Testes**: Jest com cobertura 90%+
- **CI/CD**: GitHub Actions (lint. test e deploy)
- **Deploy**: AWS Elastic Beanstalk

## Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/jennysol/ton-api.git
cd ton-api

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 4. Executar DynamoDB local
docker-compose up -d dynamodb

# 5. Criar tabelas
bash init-aws.sh

# 6. Executar aplicação
npm run start:dev
```

## Executar Testes

```bash
# Testes unitários
npm test

# Coverage report
npm run test:cov
```

## API Endpoints

### Autenticação
- `POST /auth/signup` - Registro de usuário
- `POST /auth/login` - Login com JWT

### Produtos
- `GET /products` - Listar produtos (com paginação)
- `GET /products/:id` - Buscar produto por ID
- `POST /products` - Criar produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

**[Ver documentação completa da API](https://jenifer-ton-app.com//reference)**

## Recursos de Segurança

- [x] **JWT Authentication** com refresh tokens
- [x] **bcrypt** para hash de senhas (abstração via EncryptionService)
- [x] **Validation pipes** para validação de entrada
- [x] **CORS** configurado para múltiplos domínios
- [x] **Rate limiting** para proteção contra spam
- [x] **Helmet** para headers de segurança

## Arquitetura

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│    Controllers      │    │     Services        │    │   Repositories      │
│                     │    │                     │    │                     │
│ • Route Handling    │────│ • Business Logic    │────│ • Data Access       │
│ • Validation        │    │ • Orchestration     │    │ • ElectroDB         │
│ • Swagger Docs      │    │ • Error Handling    │    │ • DynamoDB Ops      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

**[Ver documentação completa da arquitetura](https://jennysol.github.io/ton-api/architecture.html)**

## Deploy

A aplicação está configurada para deploy automático via GitHub Actions:

- **Terraform** - Infraestrutura como código
- **AWS Elastic Beanstalk** - Deployment e scaling automático
- **DynamoDB** - Banco NoSQL gerenciado
- **CI/CD** - Testes automáticos e deploy contínuo

**[Ver guia completo de deployment](https://github.com/jennysol/ton-infra)**


## Front para login e listagem de produtos
**[Front URL](https://ton-front-alpha.vercel.app/login)**

**[Ver repositório e documentação do ton-front](https://github.com/jennysol/ton-front?tab=readme-ov-file#funcionalidades)**


**[Documentação Completa](https://jennysol.github.io/ton-api/) | [API Demo](https://jenifer-ton-app.com) | [Front Demo](https://ton-front-alpha.vercel.app/login) | [Infra](https://github.com/jennysol/ton-infra)**
