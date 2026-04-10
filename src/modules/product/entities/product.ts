export interface IProduct {
	id?: string | number;
	listId?: string;
	category: string;
	name: string;
	marketName: string;
	price: number;
	quantity: number;
	unit: string;
	checked: boolean;
}

export class Product {
	constructor(readonly product: IProduct) {}
}
