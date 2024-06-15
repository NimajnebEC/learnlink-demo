import type { Key } from "$lib";

export interface Segment {
	say?: string;
	play?: string;
	tone?: Key;
}

export interface MenuNode {
	segments: Segment[];
	press: (key: Key) => MenuNode | null;
	record?: (data: Blob | null) => void;
}

export const homeNode: MenuNode = {
	segments: [{ say: "Welcome to LearnLink. Press 1 to listen. Press 2 to record." }],
	press: (key: Key) => ([1, 2].includes(key) ? categoryNode(null, key == 2) : homeNode),
};

function categoryNode(parent: string | null, record: boolean): MenuNode {
	const segments: Segment[] = [];

	if (record) segments.push({ say: "Press 0 to create." });

	const node: MenuNode = {
		segments,
		press() {
			return {
				segments: [
					{ say: "Say category name after the tone. Press any key when finished..." },
					{ tone: 5 },
				],
				press: () => categoryNode(parent, record),
				record: () => {},
			};
		},
	};

	return node;
}
