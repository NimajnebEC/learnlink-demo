import { sleep, type Key } from "$lib";

let ctx: AudioContext;
let rootNode: GainNode;

const tones: { [key in Key]: [number, number] } = {
	"1": [697, 1209],
	"2": [697, 1336],
	"3": [697, 1477],
	"4": [770, 1209],
	"5": [770, 1336],
	"6": [770, 1477],
	"7": [852, 1209],
	"8": [852, 1336],
	"9": [852, 1477],
	"0": [941, 1336],
};

export interface ToneContext {
	stop: () => void;
}

export async function toneFor(tone: Key, ms: number) {
	const ctx = startTone(tone, 0);
	await sleep(ms);
	ctx.stop();
}

export function startTone(tone: Key, min: number = 100): ToneContext {
	if (!ctx) setupSynthesizer();

	const o1 = ctx.createOscillator();
	o1.frequency.value = tones[tone][0];
	o1.connect(rootNode);

	const o2 = ctx.createOscillator();
	o2.frequency.value = tones[tone][1];
	o2.connect(rootNode);

	o1.start();
	o2.start();

	const minimum = sleep(min);

	return {
		async stop() {
			await minimum;
			o1.stop();
			o2.stop();
		},
	};
}

function setupSynthesizer() {
	ctx = new AudioContext();
	rootNode = ctx.createGain();
	rootNode.connect(ctx.destination);
	rootNode.gain.value = 0.25;
}
