import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class DeleteProductUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: { id: string; listId: string }) {
		const { id, listId } = data;
		const result = await this.productRepository.delete(id, listId);
		await this.cacheProvider.invalidateByPattern(
			`products:page:*:list:${listId}`,
		);
		return result;
	}
}
