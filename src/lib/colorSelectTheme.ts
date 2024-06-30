import {
	type Theme,
	type ClassNamesConfig,
	type ThemeConfig,
} from "react-select";
import selectTheme, { SelectTheme } from "./selectTheme";
import { type ColorOption } from "./productColorOptions";

// const dot = (color = "transparent") => ({
// 	alignItems: "center",
// 	display: "flex",

// 	":before": {
// 		backgroundColor: color,
// 		borderRadius: 10,
// 		content: '" "',
// 		display: "block",
// 		marginRight: 8,
// 		height: 10,
// 		width: 10,
// 	},
// });

const dot = (style: string) => {
	return `!flex items-center before:content-[''] before:h-4 before:w-4 before:rounded-full ${style} before:mr-1.5`;
};

const colorSelectTheme = {
	theme: (theme: Theme) => ({
		...theme,
		borderRadius: 6,
		colors: {
			...theme.colors,
			primary25: "#F5F6FA",
			primary50: "#dee2ec",
			primary: "#dee2ec",
		},
	}),
	classNames: {
		...selectTheme.classNames,
		control: ({ isFocused }) =>
			`!shadow-none ${isFocused ? "!border-[#999999]" : "!border-dark/10"}`,
		singleValue: ({ data }) =>
			`!text-dark/80 font-medium !py-0 ${dot(data.style)}`,
		valueContainer: ({ isMulti }) => `${isMulti ? "!p-2.5" : "!p-3"}`,
		input: ({ isMulti }) =>
			`!text-dark/80 !m-0 ${isMulti ? "!p-0.5" : "!p-0"}`,
		option: ({ data }) =>
			`cursor-pointer mt-1 rounded-md !px-3 !py-2 !text-sm !font-medium !text-dark ${dot(data.style)}`,
	},
} satisfies SelectTheme<ColorOption>;

export default colorSelectTheme;
