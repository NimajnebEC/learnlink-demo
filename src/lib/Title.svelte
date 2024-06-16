<script lang="ts">
	import { faArrowRotateRight, faCheckToSlot } from "@fortawesome/free-solid-svg-icons";
	import { faGithub } from "@fortawesome/free-brands-svg-icons";
	import Fa from "svelte-fa";
	import { db } from "./db";

	function reset() {
		if (!confirm("Are you sure you want to reset all data?")) return;
		db.category.clear();
		db.lesson.clear();
	}

	const open = (address: string) => window.open(address);
</script>

<div class="container">
	<h1>Learn<span>Link</span></h1>
	<p>Server phone call prototype.</p>
	<div class="controls">
		<button on:pointerdown={() => open("https://crowdsolve.net/challenge/EfP-UK-24/p/256")}>
			<Fa icon={faCheckToSlot} />
		</button>
		<button on:pointerdown={() => open("https://github.com/NimajnebEC/learnlink-prototype")}>
			<Fa icon={faGithub} />
		</button>
		<button on:pointerdown={reset}>
			<Fa icon={faArrowRotateRight} />
		</button>
	</div>
</div>

<style lang="scss">
	.container {
		border-radius: 0 10px 10px 0;
		background-color: white;
		position: absolute;
		padding: 10px 30px;
		top: 5%;
		left: 0;
	}

	h1 {
		font-size: max(30px, 3vw);

		span {
			color: #ed4f5d;
		}
	}

	.controls {
		margin-top: 10px;
		font-size: 20px;
		display: flex;
		gap: 5px;
	}
</style>
