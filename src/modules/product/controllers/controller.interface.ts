import type { RequestHandler } from "express";

export interface IController {
	handle: RequestHandler;
}
