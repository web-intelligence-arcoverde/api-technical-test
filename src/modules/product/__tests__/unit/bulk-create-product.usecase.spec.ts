import { bulkInsertQueue } from "../../../../infra/queue/queue.config";
import { BulkCreateProductUseCase } from "../../usecases/bulk-create-product.usecase";

jest.mock("../../../../infra/queue/queue.config", () => ({
	bulkInsertQueue: {
		add: jest.fn(),
	},
}));

describe("BulkCreateProductUseCase", () => {
	let bulkCreateUseCase: BulkCreateProductUseCase;

	beforeEach(() => {
		bulkCreateUseCase = new BulkCreateProductUseCase();
		jest.clearAllMocks();
	});

	it("should add products to the queue and return processing status", async () => {
		const listId = "list-123";
		const items = [
			{ name: "Product 1", listId } as any,
			{ name: "Product 2", listId } as any,
		];

		const mockJob = { id: "job-123" };
		(bulkInsertQueue.add as jest.Mock).mockResolvedValue(mockJob);

		const result = await bulkCreateUseCase.execute(listId, items);

		expect(bulkInsertQueue.add).toHaveBeenCalledWith("insert-products", {
			listId,
			items,
		});
		expect(result).toEqual({
			message: "O processamento dos produtos foi iniciado em segundo plano.",
			jobId: "job-123",
			status: "processing",
		});
	});
});
