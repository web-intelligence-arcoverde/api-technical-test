import type { IProduct } from "../../product/entities/product";

export interface IShoppingList {
	id?: string;
	title: string;
	description: string;
	category: string;
	variant: "primary" | "secondary" | "tertiary";
	totalItems: number;
	securedItems: number;
	items: IProduct[];
	ownerId: string;
	shared: boolean;
	sharedWith?: string[];
	lastModified: Date;
	createdAt?: Date;
}

export class ShoppingList {
	constructor(readonly list: IShoppingList) {}
}
