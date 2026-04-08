import { z } from "zod";

export const toggleCheckedProductValidation = z.object({
	id: z.string().min(1, "O ID do produto é obrigatório."),
	listId: z.string().min(1, "O ID da lista é obrigatório."),
	checked: z.boolean(),
});
