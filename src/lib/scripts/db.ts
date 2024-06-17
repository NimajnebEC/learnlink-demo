import Dexie, { type EntityTable } from "dexie";

export interface Category {
	code: string;
	index: string;
	parent: string;
	name: ArrayBuffer | string;
}

export interface Lesson {
	code: string;
	index: string;
	category: string;
	recording: ArrayBuffer | string;
}

export const db = new Dexie("learnlink") as Dexie & {
	category: EntityTable<Category, "code">;
	lesson: EntityTable<Lesson, "code">;
};

db.version(1).stores({
	category: "code, index, parent, name",
	lesson: "code, index, category, recording",
});
