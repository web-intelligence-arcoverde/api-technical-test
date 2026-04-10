import { ShoppingListController } from "../controllers/shopping-list.controller";
import { ShoppingListRepository } from "../repositories/shopping-list.repository";
import { CreateListUseCase } from "../usecases/create-list.usecase";
import { ListListsUseCase } from "../usecases/list-lists.usecase";
import { GetListUseCase } from "../usecases/get-list.usecase";
import { UpdateListUseCase } from "../usecases/update-list.usecase";
import { DeleteListUseCase } from "../usecases/delete-list.usecase";
import { AddProductToListUseCase } from "../usecases/add-product-to-list.usecase";
import { ProductRepository } from "../../product/repositories/product-repository";

export const makeShoppingListController = (): ShoppingListController => {
	const listRepository = new ShoppingListRepository();
	const productRepository = new ProductRepository();
	const createListUseCase = new CreateListUseCase(listRepository);
	const listListsUseCase = new ListListsUseCase(listRepository);
	const getListUseCase = new GetListUseCase(listRepository);
	const updateListUseCase = new UpdateListUseCase(listRepository);
	const deleteListUseCase = new DeleteListUseCase(listRepository);
	const addProductToListUseCase = new AddProductToListUseCase(
		listRepository,
		productRepository,
	);

	return new ShoppingListController(
		createListUseCase,
		listListsUseCase,
		getListUseCase,
		updateListUseCase,
		deleteListUseCase,
		addProductToListUseCase,
	);
};
