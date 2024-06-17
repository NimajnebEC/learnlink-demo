<script>
	import Phone from "$lib/components/Phone.svelte";
	import Title from "$lib/components/Title.svelte";

	let initialised = false;

	function initialise() {
		const u = new SpeechSynthesisUtterance("initialising");
		u.volume = 0;
		speechSynthesis.speak(u);
		initialised = true;
	}
</script>

<Title />

{#if initialised}
	<Phone />
{:else}
	<button on:click={initialise}>Start</button>
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
