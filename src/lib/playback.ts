import type { Segment } from "./nodes";

function speak(text: string, aborter: AbortController) {
	new Promise((r) => {
		const utterence = new SpeechSynthesisUtterance(text);
		utterence.rate = 0.85;

		speechSynthesis.speak(utterence);
		aborter.signal.addEventListener("abort", () => speechSynthesis.cancel());
		utterence.addEventListener("end", r);
	});
}

export function playSegment(segment: Segment, aborter: AbortController) {
	if (segment.say) speak(segment.say, aborter);
	if (segment.play) {
	}
}

export async function playSegments(segments: Segment[], aborter: AbortController) {
	for (const segment of segments) {
		playSegment(segment, aborter);
		if (aborter.signal.aborted) return;
	}
}
