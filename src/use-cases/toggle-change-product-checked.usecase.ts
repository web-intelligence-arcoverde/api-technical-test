import type { ICacheProvider } from "../core/providers/cache-service";
import type { IProductRepository } from "../core/repositories/product-repository";

export class ToggleChengeProductCheckedUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: any) {
		const { id, checked } = data;
		const updated = await this.productRepository.toggleProductChecked(
			id,
			checked,
		);
		await this.cacheProvider.invalidateByPattern("products:page:*");
		return updated;
	}
}
