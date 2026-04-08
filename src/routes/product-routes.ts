import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { CreateProductController } from "../controllers/product/create-product.controller";
import { DeleteProductController } from "../controllers/product/delete-product.controller";
import { ListProductController } from "../controllers/product/list-product.controller";
import { ToggleCheckedProductController } from "../controllers/product/toggle-checked-product.controller";
import { RedisCacheProvider } from "../infra/cache/redis-cache-provider";
import { ProductRepository } from "../repositories/product-repository";
import { CreateProductUseCase } from "../use-cases/create-product.usecase";
import { DeleteProductUseCase } from "../use-cases/delete-product.usecase";
import { ListProductsUseCase } from "../use-cases/list-product.usecase";
import { ToggleChengeProductCheckedUseCase } from "../use-cases/toggle-change-product-checked.usecase";

const router = express.Router();

const cache = new RedisCacheProvider();

const productRepository = new ProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);

const listProductUseCase = new ListProductsUseCase(productRepository, cache);

const listProductController = new ListProductController(listProductUseCase);

const createProductController = new CreateProductController(
	createProductUseCase,
);

const toggleCheckedProductUseCase = new ToggleChengeProductCheckedUseCase(
	productRepository,
	cache,
);

const toggleCheckedProductController = new ToggleCheckedProductController(
	toggleCheckedProductUseCase,
);

const deleteProductUseCase = new DeleteProductUseCase(productRepository, cache);
const deleteProductController = new DeleteProductController(
	deleteProductUseCase,
);

router.delete(
	"/:id",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await deleteProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.patch(
	"/:id/checked",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await toggleCheckedProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.get(
	"/",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await listProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

router.post(
	"/",
	async (request: Request, response: Response, next: NextFunction) => {
		try {
			await createProductController.handle(request, response, next);
		} catch (error) {
			next(error);
		}
	},
);

export default router;
