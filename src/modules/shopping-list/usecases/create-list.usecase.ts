import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class CreateListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(data: {
		name: string;
		userId: string;
	}): Promise<IShoppingList> {
		const { name, userId } = data;
		return await this.listRepository.create({
			name,
			ownerId: userId,
		});
	}
}
