import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";

export interface IProductRepository {
	findAll(page: number, limit: number, listId: string): Promise<IPagination>;
	findById(id: string, listId: string): Promise<IProduct | null>;
	create(data: IProduct): Promise<IProduct>;

	delete(id: string, listId: string): Promise<void>;
}
