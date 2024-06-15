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

export async function playSegment(segment: Segment, aborter: AbortController) {
	if (segment.tone) await toneFor(segment.tone, 1000, aborter);
	if (segment.say) await speak(segment.say, aborter);
	if (segment.play) {
	}
}

export async function playSegments(segments: Segment[], aborter: AbortController) {
	for (const segment of segments) {
		await playSegment(segment, aborter);
		if (aborter.signal.aborted) return;
	}
}
