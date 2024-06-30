import {
	type ClassNamesConfig,
	type Theme,
	type ThemeConfig,
} from "react-select";

export interface SelectTheme<T = unknown> {
	theme: ThemeConfig;
	classNames: ClassNamesConfig<T, true | false>;
}

const theme = {
	theme: (theme: Theme) => ({
		...theme,
		borderRadius: 6,
		colors: {
			...theme.colors,
			primary25: "#F5F6FA",
			primary50: "#dee2ec",
			primary: "#1C1F26",
		},
	}),
	classNames: {
		container: () => "rounded-md text-base font-medium",
		control: ({ isFocused }) =>
			`!shadow-none ${isFocused ? "!border-[#999999]" : "!border-dark/10"}`,
		menu: () => "text-dark/80 p-2",
		option: () => `cursor-pointer mt-1 rounded-md !text-sm !font-medium`,
		valueContainer: ({ isMulti }) => `${isMulti ? "!p-2.5" : "!p-3"}`,
		singleValue: () => "!text-dark/80",
		input: ({ isMulti }) =>
			`!text-dark/80 !m-0 ${isMulti ? "!p-0.5" : "!p-0"}`,
		multiValue: () => "text-base !bg-dark/10 !m-0 !mr-1.5",
		placeholder: () => "!text-[#999999]",
	},
} satisfies SelectTheme;

export default theme;
