import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../infra/firestore";
import type { IPagination } from "../entities/pagination";
import type { IProduct } from "../entities/product";
import type { IProductRepository } from "./product-repository.interface";

export class ProductRepository implements IProductRepository {
	private getCollection(listId: string) {
		return collection(db, "lists", listId, "items");
	}

	async findAll(
		page: number,
		limit: number,
		listId: string,
	): Promise<IPagination> {
		const q = query(this.getCollection(listId));
		const querySnapshot = await getDocs(q);
		const allItems: IProduct[] = [];
		querySnapshot.forEach((doc) => {
			allItems.push({ id: doc.id, ...doc.data() } as IProduct);
		});

		const total = allItems.length;
		const start = (page - 1) * limit;
		const end = start + limit;
		const data = allItems.slice(start, end);

		return {
			data,
			total,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
		};
	}

	async create(data: IProduct): Promise<IProduct> {
		const docRef = await addDoc(this.getCollection(data.listId), data);
		return { ...data, id: docRef.id };
	}

	async findById(id: string, listId: string): Promise<IProduct | null> {
		const docRef = doc(db, "lists", listId, "items", id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() } as IProduct;
		}
		return null;
	}

	async toggleProductChecked(
		id: string,
		listId: string,
		checked: boolean,
	): Promise<void> {
		const docRef = doc(db, "lists", listId, "items", id);
		await updateDoc(docRef, { checked });
	}

	async delete(id: string, listId: string): Promise<void> {
		const docRef = doc(db, "lists", listId, "items", id);
		await deleteDoc(docRef);
	}
}
