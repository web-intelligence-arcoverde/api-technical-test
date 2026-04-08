import { Router } from "express";
import { AuthControllerFactory } from "./factories/auth.factory";

const router = Router();
const authController = AuthControllerFactory.make();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
