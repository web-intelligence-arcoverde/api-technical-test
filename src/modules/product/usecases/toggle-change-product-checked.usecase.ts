import type { ICacheProvider } from "../../../infra/cache/cache-provider.interface";
import type { IProductRepository } from "../repositories/product-repository.interface";
import type { IUseCase } from "./usecase.interface";

export class ToggleChangeProductCheckedUseCase implements IUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: { id: string; listId: string; checked: boolean }) {
		const { id, listId, checked } = data;
		const updated = await this.productRepository.toggleProductChecked(
			id,
			listId,
			checked,
		);
		await this.cacheProvider.invalidateByPattern(
			`products:page:*:list:${listId}`,
		);
		return updated;
	}
}
