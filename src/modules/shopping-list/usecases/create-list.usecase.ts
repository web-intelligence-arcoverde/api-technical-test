import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "../repositories/shopping-list.repository.interface";
import type { IProduct } from "../../product/entities/product";

export interface CreateListDTO {
	title: string;
	description?: string;
	category: string;
	variant: "primary" | "secondary" | "tertiary";
	totalItems?: number;
	securedItems?: number;
	items?: IProduct[];
	userId: string;
}

export class CreateListUseCase {
	constructor(private readonly listRepository: IShoppingListRepository) {}

	async execute(data: CreateListDTO): Promise<IShoppingList> {
		return await this.listRepository.create({
			title: data.title,
			description: data.description || "",
			category: data.category,
			variant: data.variant,
			totalItems: data.totalItems || 0,
			securedItems: data.securedItems || 0,
			items: data.items || [],
			ownerId: data.userId,
			lastModified: new Date(),
		});
	}
}
