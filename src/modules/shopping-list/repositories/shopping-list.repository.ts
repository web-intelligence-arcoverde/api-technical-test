import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../infra/firestore";
import type { IShoppingList } from "../entities/shopping-list";
import type { IShoppingListRepository } from "./shopping-list.repository.interface";

export class ShoppingListRepository implements IShoppingListRepository {
	private readonly collectionName = "lists";

	async create(data: IShoppingList): Promise<IShoppingList> {
		const docRef = await addDoc(collection(db, this.collectionName), {
			...data,
			createdAt: new Date(),
		});
		return { ...data, id: docRef.id };
	}

	async findAllByUserId(userId: string): Promise<IShoppingList[]> {
		const q = query(
			collection(db, this.collectionName),
			where("ownerId", "==", userId),
		);
		const querySnapshot = await getDocs(q);
		const lists: IShoppingList[] = [];
		querySnapshot.forEach((doc) => {
			lists.push({ id: doc.id, ...doc.data() } as IShoppingList);
		});
		return lists;
	}

	async findById(id: string): Promise<IShoppingList | null> {
		const docRef = doc(db, this.collectionName, id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() } as IShoppingList;
		}
		return null;
	}

	async update(id: string, data: Partial<IShoppingList>): Promise<void> {
		const docRef = doc(db, this.collectionName, id);
		await updateDoc(docRef, data);
	}

	async delete(id: string): Promise<void> {
		const docRef = doc(db, this.collectionName, id);
		await deleteDoc(docRef);
	}
}
