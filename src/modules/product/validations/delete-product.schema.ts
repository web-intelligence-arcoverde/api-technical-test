import { z } from "zod";

export const deleteProductValidation = z.object({
	id: z.string().min(1, "O ID do produto é obrigatório."),
	listId: z.string().min(1, "O ID da lista é obrigatório."),
});
