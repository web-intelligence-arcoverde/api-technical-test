import { invalidateCacheByPattern } from "../helpers/redis-cache.helper";
import type { ProductRepository } from "../repositories/product-repository";

export interface IUseCase {
	execute(data: any): Promise<any>;
}

export class CreateProductUseCase implements IUseCase {
	constructor(private readonly productRepository: ProductRepository) {}
	async execute(data: any) {
		const user = await this.productRepository.create(data);
		await invalidateCacheByPattern("products:page:*");
		return user;
	}
}
