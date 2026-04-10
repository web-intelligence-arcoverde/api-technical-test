import { bulkInsertQueue } from "../../../infra/queue/queue.config";
import type { IProduct } from "../entities/product";

export class BulkCreateProductUseCase {
	async execute(listId: string, items: IProduct[]) {
		const job = await bulkInsertQueue.add("insert-products", {
			listId,
			items,
		});

		return {
			message: "O processamento dos produtos foi iniciado em segundo plano.",
			jobId: job.id,
			status: "processing",
		};
	}
}
