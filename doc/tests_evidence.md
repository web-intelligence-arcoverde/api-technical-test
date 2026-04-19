# Evidências de Testes - API de Lista de Compras

Este documento consolida as evidências de execução dos testes unitários e de carga para todos os módulos do sistema.

---

## 🔐 Módulo de Autenticação (Auth)

### Testes Unitários
Os testes unitários validam os fluxos de login e registro usando mocks.
```text
PASS src/modules/auth/__tests__/unit/auth.login.controller.spec.ts
PASS src/modules/auth/__tests__/unit/auth.register.controller.spec.ts

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
```

### Testes de Carga (Stress Testing)
Métricas de performance para endpoints de autenticação.
- **Login**: Estabilidade detectada sob carga.
- **Registro**: Alto volume de requisições processadas.

---

## 📦 Módulo de Produtos (Product)

### Testes Unitários
Cobertura completa dos casos de uso de criação, listagem, exclusão e alteração de status.
```text
PASS src/modules/product/__tests__/unit/delete-product.usecase.spec.ts
PASS src/modules/product/__tests__/unit/bulk-create-product.usecase.spec.ts
PASS src/modules/product/__tests__/unit/toggle-change-product-checked.usecase.spec.ts
PASS src/modules/product/__tests__/unit/create-product.usecase.spec.ts
PASS src/modules/product/__tests__/unit/delete-product.controller.spec.ts
PASS src/modules/product/__tests__/unit/list-product.controller.spec.ts
PASS src/modules/product/__tests__/unit/toggle-checked-product.controller.spec.ts
PASS src/modules/product/__tests__/unit/create-product.controller.spec.ts
PASS src/modules/product/__tests__/unit/list-product.usecase.spec.ts

Test Suites: 9 passed, 9 total
Tests:       18 passed, 18 total
```

### Testes de Carga (Stress Testing)
- **Criação e Listagem**: Performance otimizada com cache.
- **Bulk Creation**: Processamento assíncrono via fila garantindo baixa latência na API.

---

## 🛒 Módulo de Lista de Compras (Shopping List)

### Testes Unitários
Validação de regras de negócio para gerenciamento de listas.
```text
PASS src/modules/shopping-list/__tests__/unit/delete-list.usecase.spec.ts
PASS src/modules/shopping-list/__tests__/unit/update-list.usecase.spec.ts
PASS src/modules/shopping-list/__tests__/unit/get-list.usecase.spec.ts
PASS src/modules/shopping-list/__tests__/unit/list-lists-filtered.usecase.spec.ts
PASS src/modules/shopping-list/__tests__/unit/create-list.usecase.spec.ts
PASS src/modules/shopping-list/__tests__/unit/shopping-list.controller.spec.ts

Test Suites: 6 passed, 6 total
Tests:       14 passed, 14 total
```

### Testes de Carga (Stress Testing)
Resultados de alta performance para leitura e escrita:
- **Listas (Leitura)**: ~1,480 RPS com latência média de 6.25ms (Cache Ativo).
- **Listas (Escrita)**: ~1,160 RPS com latência média de 3.76ms (Fila Ativa).

---

## 📊 Resumo Executivo
| Módulo | Testes Unitários | Testes de Carga (Avg RPS) | Status |
| :--- | :--- | :--- | :--- |
| **Auth** | 4 Passou / 0 Falhou | ~3,300 | ✅ Sucesso |
| **Product** | 18 Passou / 0 Falhou | ~20 (Heavy Ops) | ✅ Sucesso |
| **Shopping List** | 14 Passou / 0 Falhou | ~1,200 | ✅ Sucesso |

---
**Data da Execução**: 2026-04-19
**Ambiente**: Desenvolvimento Local (localhost:3001)
