# Produtos

## Visão Geral

O módulo de Produtos oferece um CRUD completo para gerenciamento de produtos, com paginação eficiente, validações robustas e integração com DynamoDB.

## Arquitetura do Módulo

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ ProductsController  │    │  ProductsService    │    │ ProductsRepository  │
│                     │    │                     │    │                     │
│ • Route Handling    │────│ • Business Logic    │────│ • Data Access       │
│ • Validation        │    │ • Orchestration     │    │ • ElectroDB         │
│ • Swagger Docs      │    │ • Error Handling    │    │ • DynamoDB Ops      │
│ • Auth Guards       │    │ • Data Transform    │    │ • Query Optimization│
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## Modelo de Dados

### **Product Entity**

```typescript
interface IProduct {
  productId: string;    
  title: string;          
  description: string;   
  price: number;      
  publishDate: string;
  photoLink: string;
}
```

### **DynamoDB Schema**

```typescript
export const Product = new Entity({
  model: {
    entity: 'product',
    version: '1',
    service: 'ton-service',
  },
  attributes: {
    productId: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    price: { type: 'number', required: true },
    publishDate: { type: 'string', required: true },
    photoLink: { type: 'string', required: true },
  },
  indexes: {
    primary: {
      pk: { field: 'pk', composite: ['productId'] },
      sk: { field: 'sk', composite: [] },
    },
  },
});
```

## Funcionalidades

### **1. Listar Produtos (Paginado)**

**Endpoint:** `GET /products`

**Features:**
- Paginação com cursor
- Limite configurável
- Validação de parâmetros
- Performance otimizada

**Implementação:**
```typescript
async findAll(limit: number, nextKey?: string): Promise<IPaginatedProducts> {
  const result = await Product.scan.go({
    limit,
    cursor: nextKey || null,
  });

  return {
    products: result.data,
    nextKey: result.cursor || null,
  };
}
```

**Query Parameters:**
- `limit`: 1-100 (default: 10)
- `nextKey`: Cursor da página anterior

### **2. Buscar Produto por ID**

**Endpoint:** `GET /products/:id`

**Features:**
- Busca eficiente por chave primária
- Tratamento de produto não encontrado
- Validação de UUID

**Implementação:**
```typescript
async findById(productId: string): Promise<IProduct> {
  const result = await Product.get({ productId }).go();
  
  if (!result.data) {
    throw new NotFoundException(`Product with ID ${productId} not found`);
  }
  
  return result.data;
}
```

### **3. Criar Produto**

**Endpoint:** `POST /products`

**Features:**
- Geração automática de UUID
- Validação completa de dados
- Sanitização de entrada

**Validações:**
```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(0.01)
  @Max(999999.99)
  price: number;

  @IsISO8601()
  publishDate: string;

  @IsUrl()
  photoLink: string;
}
```

### **4. Atualizar Produto**

**Endpoint:** `PUT /products/:id`

**Features:**
- Update parcial suportado
- Validação apenas dos campos enviados
- Retorna produto atualizado

**Implementação:**
```typescript
async update(productId: string, updateData: UpdateProductDto): Promise<IProduct> {
  // Verifica se produto existe
  await this.findById(productId);
  
  const { data } = await Product.update({ productId })
    .set(updateData)
    .go({ response: 'updated_new' });
    
  return data as IProduct;
}
```

### **5. Deletar Produto**

**Endpoint:** `DELETE /products/:id`

**Features:**
- Deleção física do registro
- Verificação de existência opcional
- Resposta sem conteúdo



## Futuras Melhorias

### **1. Funcionalidades Avançadas**
- **Search**: Busca por título/descrição
- **Filtering**: Filtros por preço, data, etc.
- **Sorting**: Ordenação por diferentes campos
- **Categories**: Sistema de categorização

### **2. Performance**
- **Caching**: Redis para produtos populares
- **CDN**: Para imagens de produtos
- **Elasticsearch**: Para busca full-text
- **Read replicas**: Para queries pesadas

### **3. Validações**
- **Image validation**: Verificação de URLs de imagem
- **Price validation**: Regras de negócio para preços
- **Inventory**: Controle de estoque
- **SKU system**: Sistema de códigos de produto

### **4. Integrações**
- **Image upload**: S3 para hospedagem de imagens
- **Price monitoring**: Alertas de mudança de preço
- **Analytics**: Tracking de visualizações
- **Reviews**: Sistema de avaliações