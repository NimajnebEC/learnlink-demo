import { db } from "$lib/scripts/db";

import biology from "./recordings/biology.mp3";
import cell_biology from "./recordings/cell_biology.mp3";
import cells1 from "./recordings/cells1.mp3";
import cells2 from "./recordings/cells2.mp3";
import homeostasis from "./recordings/homeostasis.mp3";
import homeostasis1 from "./recordings/homeostasis1.mp3";
import physics from "./recordings/physics.mp3";
import astrophysics from "./recordings/astrophysics.mp3";
import astrophysics1 from "./recordings/astrophysics1.mp3";
import astrophysics2 from "./recordings/astrophysics2.mp3";
import astrophysics3 from "./recordings/astrophysics3.mp3";

export const populate = () =>
	Promise.all([
		// Biology
		db.category.add({
			code: "1",
			index: "1",
			parent: "",
			name: biology,
		}),
		db.category.add({
			code: "11",
			index: "1",
			parent: "1",
			name: cell_biology,
		}),

		// Cell Biology
		db.lesson.add({
			code: "111",
			index: "1",
			category: "11",
			recording: cells1,
		}),
		db.lesson.add({
			code: "112",
			index: "2",
			category: "11",
			recording: cells2,
		}),

		// Homeostasis
		db.category.add({
			code: "12",
			index: "2",
			parent: "1",
			name: homeostasis,
		}),
		db.lesson.add({
			code: "121",
			index: "1",
			category: "12",
			recording: homeostasis1,
		}),

		// Physics
		db.category.add({
			code: "2",
			index: "2",
			parent: "",
			name: physics,
		}),
		db.category.add({
			code: "21",
			index: "1",
			parent: "2",
			name: astrophysics,
		}),
		db.lesson.add({
			code: "211",
			index: "1",
			category: "21",
			recording: astrophysics1,
		}),
		db.lesson.add({
			code: "212",
			index: "2",
			category: "21",
			recording: astrophysics2,
		}),
		db.lesson.add({
			code: "213",
			index: "3",
			category: "21",
			recording: astrophysics3,
		}),
	]);
