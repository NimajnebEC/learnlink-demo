import type { Segment } from "./nodes";
import { toneFor } from "./tone";

function speak(text: string, aborter: AbortController) {
	return new Promise((r) => {
		const utterence = new SpeechSynthesisUtterance(text);
		utterence.rate = 0.85;

		speechSynthesis.speak(utterence);
		aborter.signal.addEventListener("abort", () => speechSynthesis.cancel());
		utterence.addEventListener("end", r);
	});
}

function play(src: string, aborter: AbortController) {
	return new Promise((r) => {
		const audio = new Audio(src);
		aborter.signal.addEventListener("abort", () => audio.pause());
		audio.addEventListener("ended", r);
		audio.play();
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
