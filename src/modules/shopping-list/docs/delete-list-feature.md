# Exclusão de Lista (`DeleteListUseCase`)
Remove uma lista de compras e todos os seus produtos.

- **Fluxo**: 
    1. Valida a propriedade da lista.
    2. Deleta todos os produtos vinculados na coleção global `products`.
    3. Deleta o documento da lista na coleção `shopping-lists`.
    4. Invalida os caches relacionados ao usuário e à lista.
- **Retorno**: Nenhum (Sucesso com Status 204).
- **router**: DELETE `/shopping-list/:id`
