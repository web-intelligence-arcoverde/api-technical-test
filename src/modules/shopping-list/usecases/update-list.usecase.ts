import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class UpdateListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(id: string, data: Partial<IShoppingList>): Promise<void> {
		const list = await this.listRepository.findById(id);
		if (!list) {
			throw new Error("Lista não encontrada");
		}

		await this.listRepository.update(id, {
			...data,
			lastModified: new Date(),
		});
	}
}
