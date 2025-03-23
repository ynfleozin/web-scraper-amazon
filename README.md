# Amazon Bestsellers Scraper API

Este projeto é uma API que coleta informações sobre três produtos da página de mais vendidos da Amazon e os armazena em um banco de dados DynamoDB, utilizando AWS Lambda, API Gateway e o Serverless Framework. A API pode ser consumida para listar os produtos mais vendidos de uma categoria específica ou todas as categorias.
## Tecnologias Utilizadas

- **Serverless Framework**
- **AWS Lambda**
- **AWS API Gateway** 
- **AWS DynamoDB**
- **Puppeteer** 
- **Node.js**+**TypeScript**
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/ynfleozin/web-scraper-amazon.git
```

Entre no diretório do projeto

```bash
  cd web-scraper-amazon
```

Instale as dependências

```bash
  npm install
```

Rode o serverless offline

```bash
  serverless offline
```

Acesse a API localmente

Após o comando serverless offline start, a API estará disponível em http://localhost:3000. Você pode testar os endpoints utilizando um cliente HTTP (como o Postman ou cURL), ou diretamente no navegador.

1. **GET /bestsellers/** Retorna três produtos da página de mais vendidos da Amazon.

2. **GET /bestsellers/{category}** Retorna os três produtos mais vendidos de uma categoria específica da Amazon.

3. **GET /products** Retorna todos os produtos armazenados no banco de dados DynamoDB.



## Deploy para AWS

Para fazer o deploy desse projeto na AWS rode

```bash
  serverless deploy
```

Após o deploy, a API estará acessível através da URL fornecida pelo API Gateway.

## Banco de Dados DynamoDB

Os dados coletados pelo web scraper são armazenados no DynamoDB, em uma tabela chamada ${service}-${stage}. A tabela possui um campo productId como chave primária.

### Exemplo de Resposta da API

```bash {
  "products": [
    {
      "productId": "xxxxxxxxx",
      "title": "Produto 1",
      "price": "R$ 100,00"
    },
    {
      "productId": "xxxxxxxxx",
      "title": "Produto 2",
      "price": "R$ 200,00"
    },
    {
      "productId": "xxxxxxxx",
      "title": "Produto 3",
      "price": "R$ 300,00"
    }
  ]
}
