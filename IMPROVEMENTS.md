# 🚀 Sugestões de Melhoria - API de Lista de Produtos

Este documento detalha as oportunidades de melhoria identificadas no projeto para elevar a qualidade do código, segurança e manutenibilidade.

## 1. 🏗️ Arquitetura e Organização de Código

### Unificação de Repositórios
Atualmente existem dois arquivos de repositório com lógica idêntica:
- `src/infra/database/sql/sql-product-repository.ts`
- `src/repositories/product-repository.ts`

**Recomendação:** Manter apenas a implementação em `src/infra/database/sql/` e garantir que o restante da aplicação dependa da interface `IProductRepository`.

### Padronização de Interfaces
Centralizar as interfaces de domínio (como `IProduct`) em `src/domain/interfaces` para evitar confusão com `src/core/interfaces`.

### Correção de Nomenclatura (Typos)
- Corrigir `ToggleChengeProductCheckedUseCase` para `ToggleChangeProductCheckedUseCase`.

---

## 2. 🧪 Testes Automatizados (Prioridade Máxima)

O projeto atualmente não possui uma suíte de testes.

**Recomendação:**
- Instalar **Vitest** ou **Jest**.
- **Testes Unitários:** Validar a lógica de negócio nos *Use Cases*.
- **Testes de Integração:** Validar os endpoints da API (Controller -> Use Case -> Repo), garantindo que o banco de dados e o cache funcionem conforme esperado.

---

## 3. 🛡️ Middlewares e Segurança

### Ordem de Execução do Rate Limit
No arquivo `src/app.ts`, o `rateLimiterMiddleware` é aplicado após as rotas.
**Correção:** Mover o middleware para antes da definição das rotas para garantir que as requisições sejam limitadas antes de qualquer processamento pesado.

### Tratamento de Erros Robusto
O `errorHandler` atual é genérico (retorna sempre 500).
**Melhoria:** 
- Tratar erros de validação do **Zod** para retornar `400 Bad Request` com a lista de campos inválidos.
- Criar classes de erros customizadas (ex: `AppError`) para distinguir erros de negócio de erros inesperados.

---

## 📊 4. Observabilidade e Logs

### Logs Estruturados
Substituir o uso de `console.log` e `console.error` por uma biblioteca como **Pino** ou **Winston**. Isso permite:
- Logs em formato JSON (melhor para ferramentas de monitoramento).
- Níveis de log (info, warn, error, debug).
- Desativação de logs específicos em produção.

---

## ⚙️ 5. Boas Práticas e DX (Developer Experience)

### Injeção de Dependência (DI)
Conforme a API crescer, considere utilizar um container de DI (como `tsyringe` ou `inversify`) ou um padrão Factory para evitar instanciar manualmente todas as classes no arquivo de rotas.

### Hooks de Git
Implementar **Husky** + **lint-staged** para rodar o Linter e os Testes automaticamente antes de cada `git commit`.

### Health Check
Adicionar um endpoint `GET /health` para que sistemas de monitoramento (como Docker ou Kubernetes) possam verificar se o serviço está saudável.
