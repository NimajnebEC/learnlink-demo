<script lang="ts">
	import { initialise as initialisePlayback, play } from "$lib/scripts/playback";
	import audio from "$lib/assets/confirmation.mp3?url";
	import Phone from "$lib/components/Phone.svelte";
	import Title from "$lib/components/Title.svelte";
	import { populate } from "$lib/inital";
	import { db } from "$lib/scripts/db";
	import { onMount } from "svelte";

	let stream: MediaStream;
	let initialised = false;

	function initialise() {
		initialisePlayback();
		play(audio, new AbortController());

		const u = new SpeechSynthesisUtterance("initialising");
		u.volume = 0;
		speechSynthesis.speak(u);
		initialised = true;
	}

	onMount(async () => {
		db.category.count().then((c) => (c == 0 ? populate() : null));
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch (e) {}
	});
</script>

<Title />

{#if initialised}
	<Phone {stream} />
{:else if stream}
	<button on:click={initialise}>Start</button>
{:else}
	<h1>Please allow Microphone</h1>
{/if}

<style lang="scss">
	button {
		background-color: white;
		border-radius: 10px;
		font-size: 25px;
		padding: 20px;
		color: black;
	}
</style>
