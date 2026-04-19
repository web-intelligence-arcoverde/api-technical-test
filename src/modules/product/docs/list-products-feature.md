# Listagem de Produtos (`ListProductUseCase`)
Retorna os produtos vinculados a uma lista de compras específica, com suporte a cache.

- **Fluxo**: Consulta a coleção de alto nível `products` no Firestore, filtrando pelo `listId`. Utiliza cache baseado no padrão `products:page:*:list:ID`.
- **Retorno**: Array de objetos de produtos.
- **router**: GET `/product` (Filtrado por query param `listId`)
