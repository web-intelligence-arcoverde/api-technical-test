import { Router } from "express";
import { cacheMiddleware } from "../../middlewares/cache.middleware";
import { makeShoppingListController } from "./factories/shopping-list.factory";

const publicRouter = Router();
const privateRouter = Router();
const listController = makeShoppingListController();

// Prioridade Máxima: Lista Pública (TTL 5 min - 300s)
publicRouter.get(
	"/:id",
	cacheMiddleware((req) => `list:shared:${req.params.id}`, 300),
	listController.getById,
);

privateRouter.post("/", listController.create);

// Prioridade Máxima: Listagem do Usuário (TTL 10 min - 600s)
privateRouter.get(
	"/",
	cacheMiddleware(
		(req) =>
			`lists:user:${req.user?.uid}:page:${req.query.page || 1}:limit:${req.query.limit || 10}`,
		600,
	),
	listController.list,
);

// Prioridade Média: Detalhes da Lista (TTL 5 min - 300s)
privateRouter.get(
	"/:id",
	cacheMiddleware(
		(req) => `list:detail:${req.params.id}:user:${req.user?.uid}`,
		300,
	),
	listController.getById,
);

privateRouter.patch("/:id", listController.update);
privateRouter.delete("/:id", listController.delete);
privateRouter.post("/:id/product", listController.addProduct);

export { publicRouter as sharedShoppingListRouter };
export default privateRouter;
