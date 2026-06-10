// Maps the granular per-post `categories` (from front matter) into a small set
// of top-level groups shown in the sidebar. Tags stay granular for fine-grained
// browsing; these groups are the high-level buckets.
//
// To add a new post: just use any granular category in front matter and map it
// here. Unmapped categories fall back to "Other".

export const order = ["AI & Data", "Engineering", "Photography", "Life"];

export const map = {
	// AI & Data
	"ml": "AI & Data",
	"mlops": "AI & Data",
	"data": "AI & Data",
	"clustering": "AI & Data",
	"sql": "AI & Data",

	// Engineering
	"tech notes": "Engineering",
	"work": "Engineering",
	"installation": "Engineering",
	"nvidia": "Engineering",
	"cloud": "Engineering",
	"aws": "Engineering",
	"terraform": "Engineering",
	"python": "Engineering",
	"software": "Engineering",

	// Photography
	"photography": "Photography",
	"tools": "Photography",

	// Life
	"studies": "Life",
	"random": "Life",
};

export default { order, map };
