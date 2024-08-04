import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./src/**/*.tsx", "./src/lib/*"],
	theme: {
		extend: {
			gridTemplateColumns: {
				"upload-layout": "repeat(auto-fill, minmax(128px, 196px))",
			},
			gridAutoRows: {
				"upload-layout": "minmax(128px, 196px)",
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans],
			},
			colors: {
				dark: "#1C1F26",
			},
		},
	},
	plugins: [],
} satisfies Config;
