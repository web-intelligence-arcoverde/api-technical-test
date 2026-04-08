import type { IShoppingList } from "../entities/shopping-list";

export interface IShoppingListRepository {
	create(data: IShoppingList): Promise<IShoppingList>;
	findAllByUserId(userId: string): Promise<IShoppingList[]>;
	findById(id: string): Promise<IShoppingList | null>;
	update(id: string, data: Partial<IShoppingList>): Promise<void>;
	delete(id: string): Promise<void>;
}
