import type { ICacheProvider } from "../core/providers/cache-service";
import type { IProductRepository } from "../core/repositories/product-repository";

export class ListProductsUseCase {
	constructor(
		private productRepository: IProductRepository,
		private cacheProvider: ICacheProvider,
	) {}

	async execute(data: any) {
		const { page = 1, limit = 10 } = data;

		const cacheKey = `products:page:${page}:limit:${limit}`;

		const cached = await this.cacheProvider.get(cacheKey);
		if (cached) {
			return cached;
		}

		const products = await this.productRepository.findAll(page, limit);

		await this.cacheProvider.set(cacheKey, products, 60 * 5); // 5 minutos

		return products;
	}
}
