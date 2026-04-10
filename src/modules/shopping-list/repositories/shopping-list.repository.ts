import { db } from "../../../infra/firestore";
import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "./shopping-list.repository.interface";

export class ShoppingListRepository implements IShoppingListRepository {
	private readonly collectionName = "lists";

	async create(data: IShoppingList): Promise<IShoppingList> {
		const docRef = await db.collection(this.collectionName).add({
			...data,
			createdAt: new Date(),
		});
		return { ...data, id: docRef.id };
	}

	async findAllByUserId(userId: string): Promise<IShoppingList[]> {
		const querySnapshot = await db
			.collection(this.collectionName)
			.where("ownerId", "==", userId)
			.get();

		const lists: IShoppingList[] = [];
		const fetchPromises = querySnapshot.docs.map(async (doc) => {
			const listData = doc.data() as IShoppingList;
			const items = await this.getItems(doc.id);
			return { id: doc.id, ...listData, items } as IShoppingList;
		});

		return Promise.all(fetchPromises);
	}

	async findById(id: string): Promise<IShoppingList | null> {
		const docSnap = await db.collection(this.collectionName).doc(id).get();
		if (docSnap.exists) {
			const listData = docSnap.data() as IShoppingList;
			const items = await this.getItems(id);
			return { id: docSnap.id, ...listData, items } as IShoppingList;
		}
		return null;
	}

	private async getItems(listId: string) {
		const itemsSnapshot = await db
			.collection(this.collectionName)
			.doc(listId)
			.collection("items")
			.get();

		return itemsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	}

	async update(id: string, data: Partial<IShoppingList>): Promise<void> {
		await db.collection(this.collectionName).doc(id).update(data);
	}

	async delete(id: string): Promise<void> {
		const listRef = db.collection(this.collectionName).doc(id);
		const itemsSnapshot = await listRef.collection("items").get();

		const batch = db.batch();

		// Deletar todos os itens da subcoleção
		for (const itemDoc of itemsSnapshot.docs) {
			batch.delete(itemDoc.ref);
		}

		// Deletar a lista principal
		batch.delete(listRef);

		await batch.commit();
	}
}
