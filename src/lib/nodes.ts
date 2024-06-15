import type { Key } from "$lib";

export interface Segment {
	say?: string;
	play?: string;
}

export interface MenuNode {
	get: () => Segment[];
	press: (key: Key) => MenuNode | null;
}

export const homeNode: MenuNode = {
	get: () => [{ say: "Welcome to LearnLink. Press 1 to listen. Press 2 to record." }],
	press: (key: Key) => homeNode,
};
