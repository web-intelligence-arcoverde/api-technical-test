# Criação de Produto (`CreateProductUseCase`)
Adiciona um novo produto a uma lista de compras existente.

- **Fluxo**: 
    1. Persiste o novo produto na coleção global `products` do Firestore.
    2. Vincula o produto à lista através do campo `listId`.
    3. Atualiza o contador `totalItems` na lista de compras pai de forma atômica.
    4. Invalida o cache de listagem de produtos daquela lista e os detalhes da lista.
- **Retorno**: Objeto contendo os dados do produto criado (incluindo `id`).
- **router**: POST `/product`
