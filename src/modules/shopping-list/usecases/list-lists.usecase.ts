import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class ListListsUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(
		userId: string,
		page = 1,
		limit = 10,
	): Promise<IShoppingList[]> {
		const offset = (page - 1) * limit;
		return await this.listRepository.findAllByUserId(userId, limit, offset);
	}
}
