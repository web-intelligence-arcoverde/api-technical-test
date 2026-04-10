import { db } from "../../../infra/firestore";
import {
	SHOPPING_LIST_JOBS,
	shoppingListQueue,
} from "../../../infra/queue/shopping-list.queue";
import type { IProduct } from "../../product/entities/product";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class AddProductToListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

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

		// Generate ID for the new product
		const productId = db
			.collection("lists")
			.doc(listId)
			.collection("items")
			.doc().id;

		const product: IProduct = {
			...productData,
			id: productId,
			listId,
		};

		// Enfileira a adição do produto e atualização da lista
		await shoppingListQueue.add(SHOPPING_LIST_JOBS.ADD_PRODUCT, {
			listId,
			productData: product,
		});

		return product;
	}
}
