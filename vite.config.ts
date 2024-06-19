import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				name: "LearnLink",
				display: "standalone",
				theme_color: "#52b2da",
				short_name: "LearnLink",
				background_color: "#52b2da",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-384x384.png",
						sizes: "384x384",
						type: "image/png",
					},
				],
			},
		}),
	],
});
