# Explicação do docker-compose.yml

```yaml
version: '3.8'
```

Define a versão do Docker Compose. A versão `3.8` é amplamente compatível com recursos modernos.

---

## Services (Serviços)

### 1. `redis`

```yaml
redis:
  image: redis:7
```

Usa a imagem oficial do Redis versão 7.

```yaml
container_name: node_boilerplate_redis
```

Nome do container para facilitar a identificação.

```yaml
ports:
  - '6379:6379'
```

Mapeia a porta padrão do Redis (6379) do container para a máquina host.

```yaml
networks:
  - app-network
```

Conecta o Redis à rede interna `app-network`.

---

### 2. `app`

```yaml
app:
  build: .
```

Constrói a imagem da aplicação usando o `Dockerfile` presente na raiz do projeto.

```yaml
container_name: node_boilerplate_app
```

Nome do container da aplicação.

```yaml
ports:
  - '3000:3000'
```

Expõe a aplicação na porta 3000 (mapeada da porta interna do container).

```yaml
environment:
  REDIS_URL: redis://redis:6379
  FIREBASE_API_KEY: ${FIREBASE_API_KEY}
```

Passa as variáveis de ambiente necessárias. O `REDIS_URL` aponta para o nome do serviço `redis` na rede interna do Docker.

```yaml
depends_on:
  - redis
```

Garante que o container do Redis seja iniciado antes da aplicação.

```yaml
networks:
  - app-network
```

Conecta à mesma rede do Redis para permitir a comunicação.

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Mapeia o diretório atual para `/app` dentro do container, permitindo o desenvolvimento com "hot reload". O volume `/app/node_modules` garante que as dependências do container não sejam sobrescritas pelas locais.

```yaml
command: npm run dev
```

Comando padrão para iniciar a aplicação em modo de desenvolvimento.

---

## Networks

```yaml
networks:
  app-network:
    driver: bridge
```

Cria uma rede isolada do tipo `bridge` onde os containers podem se comunicar entre si utilizando os nomes dos serviços como hostnames (ex: a aplicação acessa o Redis via `redis:6379`).
