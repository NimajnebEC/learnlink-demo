import type { Key } from "$lib";
import { db } from "./db";

export interface Segment {
	say?: string;
	play?: string;
	tone?: Key;
}

export type MenuNode = {
	segments: Segment[];
	press: (key: Key, recording: () => Promise<Blob | null>) => Promise<MenuNode | null>;
};

export const homeNode: MenuNode = {
	segments: [{ say: "Welcome to LearnLink. Press 1 to listen. Press 2 to record." }],
	press: async (key: Key) => ([1, 2].includes(key) ? categoryNode("", key == 2) : homeNode),
};

async function categoryNode(parent: string, record: boolean): Promise<MenuNode> {
	const segments: Segment[] = [];

	const entries = await db.category.where({ parent }).toArray();
	for (const entry of entries) {
		segments.push({ say: `Press ${entry.index} for` });
		segments.push({ play: URL.createObjectURL(entry.name) });
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
						name: blob,
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
