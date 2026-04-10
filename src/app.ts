import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";
import { authMiddleware } from "./middlewares/auth.middleware";
import errorHandler from "./middlewares/error-handle";
import rateLimiterMiddleware from "./middlewares/rate-limit";
import authRoutes from "./modules/auth/routes";
import productRoutes from "./modules/product/routes";
import shoppingListRoutes, {
	sharedShoppingListRouter,
} from "./modules/shopping-list/routes";

import "./infra/queue/bulk-insert.worker";
import "./infra/queue/shopping-list.worker";

import { requestLogger } from "./middlewares/logger.middleware";

const app = express();
app.use(requestLogger);
app.use(cors());
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		swaggerOptions: {
			requestSnippetsEnabled: true,
		},
	}),
);

app.use(express.json());
app.use(rateLimiterMiddleware);

app.use("/auth", authRoutes);
app.use("/shopping-list/shared", sharedShoppingListRouter);
app.use("/shopping-list", authMiddleware, shoppingListRoutes);
app.use("/product", authMiddleware, productRoutes);
app.use(errorHandler);

export default app;
