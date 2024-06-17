import audio from "$lib/assets/confirmation.mp3?url";

import type { Segment } from "./nodes";
import { toneFor } from "./tone";

export let context: AudioContext;

export function initialise() {
	context = new window.AudioContext();
}

function speak(text: string, aborter: AbortController) {
	return new Promise((r) => {
		const utterence = new SpeechSynthesisUtterance(text);
		utterence.rate = 0.95;

		speechSynthesis.speak(utterence);
		aborter.signal.addEventListener("abort", () => speechSynthesis.cancel());
		utterence.addEventListener("end", r);
	});
}

export function play(src: string | ArrayBuffer, aborter: AbortController) {
	return new Promise(async (r) => {
		const source = context.createBufferSource();

		let buffer: ArrayBuffer;
		if (src instanceof ArrayBuffer) buffer = src;
		else buffer = await fetch(audio).then((r) => r.arrayBuffer());

		source.buffer = await context.decodeAudioData(buffer);
		source.connect(context.destination);

		aborter.signal.addEventListener("abort", () => source.stop());
		source.addEventListener("ended", r);
		source.start();
	});
}

export async function playSegment(segment: Segment, aborter: AbortController) {
	if (segment.tone) await toneFor(segment.tone, 1000, aborter);
	if (segment.play) await play(segment.play, aborter);
	if (segment.say) await speak(segment.say, aborter);
}

export async function playSegments(segments: Segment[], aborter: AbortController) {
	for (const segment of segments) {
		await playSegment(segment, aborter);
		if (aborter.signal.aborted) return;
	}
}
