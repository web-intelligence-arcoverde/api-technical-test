import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../../infra/cache/cache-provider.interface";
import type { IShoppingListRepository } from "../../../shopping-list/repositories/shopping-list.repository.interface";
import { ProductRepository } from "../../repositories/product-repository";
import { DeleteProductUseCase } from "../../usecases/delete-product.usecase";

jest.mock("firebase-admin", () => {
	const mockFirestore = jest.fn(() => ({
		collection: jest.fn().mockReturnThis(),
		doc: jest.fn().mockReturnThis(),
		update: jest.fn(),
	}));

	// @ts-expect-error
	mockFirestore.FieldValue = {
		increment: jest.fn((val) => `increment(${val})`),
	};

	return {
		auth: jest.fn(),
		firestore: mockFirestore,
		credential: {
			cert: jest.fn(),
		},
		initializeApp: jest.fn(),
		apps: [],
	};
});
jest.mock("../../repositories/product-repository");

describe("DeleteProductUseCase", () => {
	let deleteProductUseCase: DeleteProductUseCase;
	let productRepository: jest.Mocked<ProductRepository>;
	let cacheProvider: jest.Mocked<ICacheProvider>;
	let shoppingListRepository: jest.Mocked<IShoppingListRepository>;

	beforeEach(() => {
		productRepository =
			new ProductRepository() as jest.Mocked<ProductRepository>;
		cacheProvider = {
			invalidateByPattern: jest.fn().mockResolvedValue(undefined),
			get: jest.fn(),
			set: jest.fn(),
			del: jest.fn(),
		} as unknown as jest.Mocked<ICacheProvider>;
		shoppingListRepository = {
			update: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<IShoppingListRepository>;

		deleteProductUseCase = new DeleteProductUseCase(
			productRepository,
			cacheProvider,
			shoppingListRepository,
		);
		jest.clearAllMocks();
	});

	it("should delete a product, update list count and invalidate the cache", async () => {
		const productId = "product-123";
		const productData = {
			id: productId,
			name: "Test Product",
			listId: "list-123",
			checked: true,
		};

		productRepository.findById.mockResolvedValue(productData as any);
		productRepository.delete.mockResolvedValue(undefined);

		await deleteProductUseCase.execute({ id: productId });

		expect(productRepository.findById).toHaveBeenCalledWith(productId);
		expect(productRepository.delete).toHaveBeenCalledWith(productId);
		expect(shoppingListRepository.update).toHaveBeenCalledWith(
			productData.listId,
			expect.objectContaining({
				totalItems: "increment(-1)",
				securedItems: "increment(-1)",
			}),
		);
		expect(cacheProvider.invalidateByPattern).toHaveBeenCalledWith(
			`products:page:*:list:${productData.listId}`,
		);
		expect(cacheProvider.invalidateByPattern).toHaveBeenCalledWith(
			`list:detail:${productData.listId}:*`,
		);
	});

	it("should only decrement totalItems if product is not checked", async () => {
		const productId = "product-123";
		const productData = {
			id: productId,
			name: "Test Product",
			listId: "list-123",
			checked: false,
		};

		productRepository.findById.mockResolvedValue(productData as any);
		productRepository.delete.mockResolvedValue(undefined);

		await deleteProductUseCase.execute({ id: productId });

		expect(shoppingListRepository.update).toHaveBeenCalledWith(
			productData.listId,
			expect.objectContaining({
				totalItems: "increment(-1)",
				securedItems: undefined,
			}),
		);
	});

	it("should return early if product is not found", async () => {
		productRepository.findById.mockResolvedValue(null);

		await deleteProductUseCase.execute({ id: "non-existent" });

		expect(productRepository.delete).not.toHaveBeenCalled();
		expect(shoppingListRepository.update).not.toHaveBeenCalled();
	});
});
