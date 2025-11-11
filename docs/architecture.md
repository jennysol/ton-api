# Arquitetura

## Visão Geral

A Ton Products API segue uma **arquitetura em camadas** baseada nos princípios de Clean Architecture e Domain-Driven Design, garantindo separação de responsabilidades e alta testabilidade.

## Diagrama de Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │────│    Service      │────│   Repository    │
│                 │    │                 │    │                 │
│ • Validation    │    │ • Business      │    │ • Data Access   │
│ • HTTP Handling │    │   Logic         │    │ • ElectroDB     │
│ • Auth Guards   │    │ • Orchestration │    │ • DynamoDB      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│   DTOs/Models   │──────────────┘
                        │                 │
                        │ • Interfaces    │
                        │ • Validation    │
                        │ • Type Safety   │
                        └─────────────────┘
```

## Camadas da Aplicação

### 1. **Controller Layer**
- **Responsabilidade**: Interface HTTP e validação de entrada
- **Tecnologias**: NestJS Controllers, Class Validator
- **Características**:
  - Validação de parâmetros e body
  - Transformação de dados
  - Documentação Swagger/OpenAPI

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  async findAll(@Query() query: FindAllQueryDto) {
    return await this.productsService.findAll(query);
  }
}
```

### 2. **Service Layer**
- **Responsabilidade**: Lógica de negócio e orquestração
- **Tecnologias**: NestJS Services, Dependency Injection
- **Características**:
  - Regras de negócio
  - Orquestração entre repositórios
  - Transformação de dados
  - Abstração da camada de dados

```typescript
@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}
  
  async findAll(query: FindAllQueryDto): Promise<PaginatedResult> {
    // Business logic here
    return await this.repository.findAll(query);
  }
}
```

### 3. **Repository Layer**
- **Responsabilidade**: Acesso e persistência de dados
- **Tecnologias**: ElectroDB, DynamoDB
- **Características**:
  - Operações CRUD
  - Query optimization
  - Tratamento de exceções de banco
  - Abstração do banco de dados

```typescript
@Injectable()
export class ProductsRepository {
  async findAll(limit: number, nextKey?: string) {
    return await Product.scan.go({ limit, cursor: nextKey });
  }
}
```

## Padrões Arquiteturais

### 1. **Dependency Injection**
- Inversão de controle para baixo acoplamento
- Facilita testes unitários
- Gerenciado pelo NestJS IoC container

### 2. **Repository Pattern**
- Abstração da camada de persistência
- Facilita mudanças de banco de dados
- Isola lógica de negócio do acesso a dados

### 3. **DTO Pattern**
- Data Transfer Objects para validação
- Type safety entre camadas
- Documentação automática da API

### 4. **Guard Pattern**
- Proteção de rotas com JWT
- Middleware de autenticação
- Controle de acesso baseado em roles (futuro)

## Módulos da Aplicação

### **Auth Module**
```typescript
@Module({
  imports: [JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, EncryptionService],
  exports: [AuthService],
})
export class AuthModule {}
```

### **Products Module**
```typescript
@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### **Users Module**
```typescript
@Module({
  controllers: [],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

## Segurança

### **Autenticação JWT**
- Tokens stateless
- Expiração configurável


### **Criptografia**
- bcrypt para senhas
- Salt rounds configurável
- Abstração via EncryptionService

### **Validação**
- Class Validator para DTOs
- Sanitização de entrada
- Type safety com TypeScript

## Banco de Dados

### **DynamoDB Design**
- Single Table Design
- GSI para queries eficientes
- ElectroDB para type safety

### **Entidades**

- User
- Product

#### **Table**
```
PK: USER#{userId}
SK: PROFILE
GSI1PK: EMAIL#{email}
GSI1SK: PROFILE

PK: PRODUCT#{productId}
SK: METADATA
```


## Testabilidade

### **Testes Unitários**
- Mocks para dependências
- Isolamento de camadas


## Fluxo de Request

1. **HTTP Request** → Controller
2. **Validation** → DTO Validation
3. **Authentication** → JWT Guard
4. **Business Logic** → Service Layer
5. **Data Access** → Repository Layer
6. **Database** → DynamoDB
7. **Response** → JSON/Error Handling

## Escalabilidade

### **Horizontal Scaling**
- Stateless design
- Database partitioning ready
- Load balancer friendly

### **Performance**
- DynamoDB single-digit latency
- Connection pooling
- Caching strategy (Redis - futuro)

### **Monitoring**
- Structured logging
- Health checks
- Metrics collection (futuro)