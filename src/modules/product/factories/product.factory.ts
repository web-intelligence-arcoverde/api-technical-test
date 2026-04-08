import { RedisCacheProvider } from "../../../infra/cache/redis.provider";
import { CreateProductController } from "../controllers/create-product.controller";
import { DeleteProductController } from "../controllers/delete-product.controller";
import { ListProductController } from "../controllers/list-product.controller";
import { ToggleCheckedProductController } from "../controllers/toggle-checked-product.controller";
import { ProductRepository } from "../repositories/product-repository";
import { CreateProductUseCase } from "../usecases/create-product.usecase";
import { DeleteProductUseCase } from "../usecases/delete-product.usecase";
import { ListProductsUseCase } from "../usecases/list-product.usecase";
import { ToggleChangeProductCheckedUseCase } from "../usecases/toggle-change-product-checked.usecase";

export class ProductControllerFactory {
	private static getDependencies() {
		const repository = new ProductRepository();
		const cache = new RedisCacheProvider();
		return { repository, cache };
	}

	static makeList(): ListProductController {
		const { repository, cache } = ProductControllerFactory.getDependencies();
		const useCase = new ListProductsUseCase(repository, cache);
		return new ListProductController(useCase);
	}

	static makeCreate(): CreateProductController {
		const { repository } = ProductControllerFactory.getDependencies();
		const useCase = new CreateProductUseCase(repository);
		return new CreateProductController(useCase);
	}

	static makeToggleChecked(): ToggleCheckedProductController {
		const { repository, cache } = ProductControllerFactory.getDependencies();
		const useCase = new ToggleChangeProductCheckedUseCase(repository, cache);
		return new ToggleCheckedProductController(useCase);
	}

	static makeDelete(): DeleteProductController {
		const { repository, cache } = ProductControllerFactory.getDependencies();
		const useCase = new DeleteProductUseCase(repository, cache);
		return new DeleteProductController(useCase);
	}
}
