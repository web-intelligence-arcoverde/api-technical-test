import type { ICacheProvider } from "../../../../infra/cache/cache-provider.interface";
import { ProductRepository } from "../../repositories/product-repository";
import { ListProductsUseCase } from "../../usecases/list-product.usecase";

jest.mock("../../repositories/product-repository");

describe("ListProductsUseCase", () => {
	let listProductsUseCase: ListProductsUseCase;
	let productRepository: jest.Mocked<ProductRepository>;
	let cacheProvider: jest.Mocked<ICacheProvider>;

	beforeEach(() => {
		productRepository =
			new ProductRepository() as jest.Mocked<ProductRepository>;
		cacheProvider = {
			get: jest.fn(),
			set: jest.fn(),
			invalidateByPattern: jest.fn(),
			del: jest.fn(),
		} as unknown as jest.Mocked<ICacheProvider>;

		listProductsUseCase = new ListProductsUseCase(
			productRepository,
			cacheProvider,
		);
		jest.clearAllMocks();
	});

	it("should return cached products if available", async () => {
		const listId = "list-123";
		const mockProducts = {
			items: [{ id: "1", name: "Cached Product" }],
			total: 1,
		};
		cacheProvider.get.mockResolvedValue(mockProducts);

		const result = await listProductsUseCase.execute({ listId });

		expect(cacheProvider.get).toHaveBeenCalledWith(
			`products:page:1:limit:10:list:${listId}`,
		);
		expect(productRepository.findAll).not.toHaveBeenCalled();
		expect(result).toEqual(mockProducts);
	});

	it("should find products from repository and set cache if not cached", async () => {
		const listId = "list-123";
		const mockProducts = {
			items: [{ id: "1", name: "Repo Product" }],
			total: 1,
		};
		cacheProvider.get.mockResolvedValue(null);
		productRepository.findAll.mockResolvedValue(mockProducts as any);

		const result = await listProductsUseCase.execute({
			listId,
			page: 1,
			limit: 10,
		});

		expect(productRepository.findAll).toHaveBeenCalledWith(1, 10, listId);
		expect(cacheProvider.set).toHaveBeenCalledWith(
			`products:page:1:limit:10:list:${listId}`,
			mockProducts,
			300,
		);
		expect(result).toEqual(mockProducts);
	});
});
