export interface IShoppingList {
	id?: string;
	name: string;
	ownerId: string;
	sharedWith?: string[];
	createdAt?: Date;
}

export class ShoppingList {
	constructor(readonly list: IShoppingList) {}
}
