import type { Key } from "$lib";
import { db } from "./db";

const LAYERS = 3;

export interface Segment {
	say?: string;
	play?: string | ArrayBuffer;
	tone?: Key;
}

export type MenuNode = {
	segments: Segment[];
	press: (key: Key, recording: () => Promise<Blob | null>) => Promise<MenuNode | null>;
	hangup?: (recording: Promise<Blob | null>) => void;
};

export const homeNode: MenuNode = {
	segments: [{ say: "Welcome to LearnLink. Press 1 to listen. Press 2 to record." }],
	press: async (key: Key) => ([1, 2].includes(key) ? categoryNode("", key == 2) : homeNode),
};

async function getLayer(code: string): Promise<number> {
	if (code == "") return 0;

	const parent = (await db.category.get(code))!.parent;
	return (await getLayer(parent)) + 1;
}

async function categoryNode(parent: string, record: boolean): Promise<MenuNode> {
	if ((await getLayer(parent)) + 1 >= LAYERS) {
		if (record) return await recordLesson(parent);
		return await playLesson(parent);
	}

	const segments: Segment[] = [];

	const entries = await db.category.where({ parent }).toArray();
	if (entries.length == 0) segments.push({ say: "No entries found" });
	for (const entry of entries) {
		segments.push({ say: `Press ${entry.index} for` });
		segments.push({ play: entry.name });
	}

	if (record) segments.push({ say: "Press 0 to create." });
	const self: MenuNode = {
		segments,
		async press(key) {
			if (key != 0) {
				const entry = entries.find((v) => v.index == key.toString());
				if (entry) return await categoryNode(entry.code, record);
				return self;
			}

			return {
				segments: [
					{ say: "Say category name after the tone. Press any key when finished" },
					{ tone: 5 },
				],
				async press(_, recording) {
					const blob = await recording();

					if (!blob) return null;

					const index = `${entries.length + 1}`;
					const code = `${parent ?? ""}${index}`;
					await db.category.add({
						name: await blob.arrayBuffer(),
						parent,
						index,
						code,
					});

					const next = await categoryNode(code, record);
					next.segments = [{ say: "Category Created!" }, ...next.segments];
					return next;
				},
			};
		},
	};

	return self;
}

async function recordLesson(category: string): Promise<MenuNode> {
	const index = ((await db.lesson.where({ category }).count()) + 1).toString();

	return {
		segments: [{ say: `Reecord lesson ${index} after the tone` }, { tone: 5 }],
		press: async () => null,
		async hangup(recording) {
			const blob = await recording;
			if (!blob) return;

			await db.lesson.add({
				code: `${category}${index}`,
				recording: await blob.arrayBuffer(),
				category,
				index,
			});
		},
	};
}

async function playLesson(category: string): Promise<MenuNode> {
	const count = await db.lesson.where({ category }).count();

	if (count == 0)
		return {
			segments: [{ say: "There are no lessons for this topic." }],
			press: async () => null,
		};

	const self: MenuNode = {
		segments: [
			{
				say: `Enter lesson number. There ${count == 1 ? "is" : "are"} ${count} lesson${
					count == 1 ? "" : "s"
				} for this topic.`,
			},
		],
		async press(key) {
			const lesson = await db.lesson.get(`${category}${key}`);
			if (!lesson) return self;
			return {
				segments: [{ play: lesson.recording }],
				press: async () => null,
			};
		},
	};

	return self;
}
