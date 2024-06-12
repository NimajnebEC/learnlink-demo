import type { Key } from "$lib";

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

export function startTone(tone: Key): ToneContext {
	const ctx = new AudioContext();
	const g = ctx.createGain();
	g.connect(ctx.destination);
	g.gain.value = 0.25;

	const o1 = ctx.createOscillator();
	o1.frequency.value = tones[tone][0];
	o1.connect(g);

	const o2 = ctx.createOscillator();
	o2.frequency.value = tones[tone][1];
	o2.connect(g);

	o1.start();
	o2.start();

	return {
		stop: () => {
			g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.04);
			setTimeout(() => ctx.close(), 50);
		},
	};
}
