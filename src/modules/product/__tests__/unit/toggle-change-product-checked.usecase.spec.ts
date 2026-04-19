import * as admin from "firebase-admin";
import type { ICacheProvider } from "../../../../infra/cache/cache-provider.interface";
import type { IShoppingListRepository } from "../../../shopping-list/repositories/shopping-list.repository.interface";
import { ProductRepository } from "../../repositories/product-repository";
import { ToggleChangeProductCheckedUseCase } from "../../usecases/toggle-change-product-checked.usecase";

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

describe("ToggleChangeProductCheckedUseCase", () => {
	let toggleUseCase: ToggleChangeProductCheckedUseCase;
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

		toggleUseCase = new ToggleChangeProductCheckedUseCase(
			productRepository,
			cacheProvider,
			shoppingListRepository,
		);
		jest.clearAllMocks();
	});

	it("should toggle product checked status, update securedItems and invalidate cache", async () => {
		const productId = "product-123";
		const productData = { id: productId, listId: "list-123", checked: false };

		productRepository.findById.mockResolvedValue(productData as any);
		productRepository.toggleProductChecked.mockResolvedValue(undefined);

		await toggleUseCase.execute({ id: productId, checked: true });

		expect(productRepository.findById).toHaveBeenCalledWith(productId);
		expect(productRepository.toggleProductChecked).toHaveBeenCalledWith(
			productId,
			true,
		);
		expect(shoppingListRepository.update).toHaveBeenCalledWith(
			productData.listId,
			expect.objectContaining({
				securedItems: "increment(1)",
			}),
		);
		expect(cacheProvider.invalidateByPattern).toHaveBeenCalledWith(
			`products:page:*:list:${productData.listId}`,
		);
	});

	it("should decrement securedItems when unchecking", async () => {
		const productId = "product-123";
		const productData = { id: productId, listId: "list-123", checked: true };

		productRepository.findById.mockResolvedValue(productData as any);
		productRepository.toggleProductChecked.mockResolvedValue(undefined);

		await toggleUseCase.execute({ id: productId, checked: false });

		expect(shoppingListRepository.update).toHaveBeenCalledWith(
			productData.listId,
			expect.objectContaining({
				securedItems: "increment(-1)",
			}),
		);
	});

	it("should throw error if product is not found", async () => {
		productRepository.findById.mockResolvedValue(null);

		await expect(
			toggleUseCase.execute({ id: "non-existent", checked: true }),
		).rejects.toThrow("Product not found");
	});
});
