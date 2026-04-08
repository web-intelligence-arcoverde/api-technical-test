import { Router } from "express";
import { ShoppingListControllerFactory } from "./factories/shopping-list.factory";

const router = Router();
const listController = ShoppingListControllerFactory.make();

router.post("/", listController.create);
router.get("/", listController.list);

export default router;
