import type { IProduct } from "../../product/entities/product";
import type { IProductRepository } from "../../product/repositories/product-repository.interface";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class AddProductToListUseCase {
	constructor(
		private readonly listRepository: IShoppingListRepository,
		private readonly productRepository: IProductRepository,
	) {}

	async execute(
		listId: string,
		userId: string,
		productData: Omit<IProduct, "listId">,
	) {
		const list = await this.listRepository.findById(listId);

		if (!list) {
			const error = new Error("Shopping list not found");
			// biome-ignore lint/suspicious/noExplicitAny: Adding status code to error
			(error as any).statusCode = 404;
			throw error;
		}

		if (list.ownerId !== userId) {
			const error = new Error("You don't have permission to modify this list");
			// biome-ignore lint/suspicious/noExplicitAny: Adding status code to error
			(error as any).statusCode = 403;
			throw error;
		}

		const product = await this.productRepository.create({
			...productData,
			listId,
		});

		// Update list metadata
		await this.listRepository.update(listId, {
			totalItems: (list.totalItems || 0) + 1,
			lastModified: new Date(),
		});

		return product;
	}
}
