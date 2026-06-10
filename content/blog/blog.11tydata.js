import { map as groupMap } from "../../_data/categoryGroups.js";

export default {
	tags: ["posts"],
	layout: "layouts/post.njk",
	templateEngineOverride: "md",
	eleventyComputed: {
		// Derive ONE primary top-level group for each post from its first
		// granular category. Falls back to "Other" if unmapped.
		categoryGroup: (data) => {
			const cats = data.categories || [];
			for (const c of cats) {
				const g = groupMap[String(c).toLowerCase()];
				if (g) return g;
			}
			return "Other";
		},
	},
};
