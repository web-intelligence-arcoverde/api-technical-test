import express from "express";
import { ProductControllerFactory } from "./factories/product.factory";

const router = express.Router();

const listProductController = ProductControllerFactory.makeList();
const createProductController = ProductControllerFactory.makeCreate();
const toggleCheckedProductController =
	ProductControllerFactory.makeToggleChecked();
const deleteProductController = ProductControllerFactory.makeDelete();

router.delete("/:id", deleteProductController.handle);
router.get("/", listProductController.handle);
router.post("/", createProductController.handle);
router.patch("/:id/toggle-checked", toggleCheckedProductController.handle);

export default router;
