# Ton Products API

Uma API RESTful completa para gerenciamento de produtos e autenticação de usuários, construída com NestJS, DynamoDB e JWT.

## Visão Geral

A **Ton Products API** é uma aplicação backend moderna que oferece:

- **Sistema de Autenticação JWT** completo com signup/login
- **CRUD de Produtos** com paginação eficiente
- **Arquitetura em Camadas** (Repository, Service, Controller)
- **Documentação OpenAPI/Swagger** automática
- **Testes Automatizados** com alta cobertura
- **CI/CD** com GitHub Actions

## Índice

- [Instalação](installation.md) - Setup, dependências e desenvolvimento
- [Arquitetura](architecture.md) - Padrões, módulos e estrutura do sistema
- [Autenticação](authentication.md) - Sistema de auth, JWT e segurança
- [Produtos](products.md) - CRUD completo, validações e paginação

## Tecnologias

- **Backend**: NestJS + TypeScript
- **Banco de Dados**: DynamoDB + ElectroDB
- **Autenticação**: JWT + bcrypt
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest
- **CI/CD**: GitHub Actions

## Links Úteis

- [Repositório no GitHub](https://github.com/jennysol/Ton-products)
- [Swagger UI](http://localhost:3000/reference) (quando rodando localmente)
- [Collection do Postman](postman-collection.json)
