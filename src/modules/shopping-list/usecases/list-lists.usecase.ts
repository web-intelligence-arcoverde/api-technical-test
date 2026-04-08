import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class ListListsUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(userId: string): Promise<IShoppingList[]> {
		return await this.listRepository.findAllByUserId(userId);
	}
}
