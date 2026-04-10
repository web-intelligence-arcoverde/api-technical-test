import { Router } from "express";
import { makeShoppingListController } from "./factories/shopping-list.factory";

const router = Router();
const listController = makeShoppingListController();

router.post("/", listController.create);
router.get("/", listController.list);
router.get("/:id", listController.getById);
router.patch("/:id", listController.update);
router.delete("/:id", listController.delete);
router.post("/:id/product", listController.addProduct);

export default router;
