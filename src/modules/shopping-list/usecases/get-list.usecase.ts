import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class GetListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(id: string): Promise<IShoppingList> {
		const list = await this.listRepository.findById(id);
		if (!list) {
			throw new Error("Lista não encontrada");
		}
		return list;
	}
}
