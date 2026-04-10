import { invalidateCacheByPattern } from "../../../infra/cache/redis.helper";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";

export class DeleteListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(id: string): Promise<void> {
		const list = await this.listRepository.findById(id);
		if (!list) {
			throw new Error("Lista não encontrada");
		}

		await this.listRepository.delete(id);

		// Invalida a listagem do usuário, detalhes e compartilhamento
		await invalidateCacheByPattern(`lists:user:${list.ownerId}:*`);
		await invalidateCacheByPattern(`list:detail:${id}:*`);
		await invalidateCacheByPattern(`list:shared:${id}`);
	}
}
