# Guia de Instalação

## Pré-requisitos

- **Node.js** 20+ (LTS recomendado)
- **npm** ou **yarn**
- **Docker** (para DynamoDB local)
- **AWS CLI** (opcional, para deploy)

## Instalação Local

### 1. Clone o Repositório

```bash
git clone https://github.com/jennysol/Ton-products.git
cd Ton-products
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# AWS Configuration
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://localhost:4566

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Encryption Configuration
SALT_ROUNDS=12
```

### 4. Inicie o DynamoDB Local

#### Usando Docker Compose (Recomendado)

```bash
docker-compose up -d
```

#### Usando LocalStack

```bash
docker run -p 4566:4566 localstack/localstack
```

### 5. Execute as Migrações (se aplicável)

```bash
npm run migration:run
```

### 6. Inicie a Aplicação

#### Modo Desenvolvimento

```bash
npm run start:dev
```

#### Modo Produção

```bash
npm run build
npm start
```

## Executando Testes

### Testes Unitários

```bash
npm test
```

### Testes com Coverage

```bash
npm run test:cov
```

### Testes E2E

```bash
npm run test:e2e
```

## Verificando a Instalação

1. **API**: Acesse `http://localhost:3000`
2. **Swagger**: Acesse `http://localhost:3000/reference`
3. **Health Check**: `GET http://localhost:3000/health`


## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia em modo produção |
| `npm run start:dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila para produção |
| `npm test` | Executa testes unitários |
| `npm run test:cov` | Testes com cobertura |
| `npm run lint` | Executa ESLint |
| `npm run format` | Formata código com Prettier |

## Docker

### Build da Imagem

```bash
docker build -t ton-products .
```

### Executar Container

```bash
docker run -p 3000:3000 --env-file .env ton-products
```