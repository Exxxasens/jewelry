import Select, {
	type GroupBase,
	type Props as SelectProps,
} from "react-select";
import colorSelectTheme from "~/lib/colorSelectTheme";
import productColorOptions, {
	type ColorOption,
} from "~/lib/productColorOptions";

type ColorSelectProps = SelectProps<ColorOption, false, GroupBase<ColorOption>>;

const ColorSelect: React.FC<ColorSelectProps> = (props) => {
	return (
		<Select
			isMulti={false}
			placeholder="Цвет"
			isSearchable={true}
			options={productColorOptions}
			{...colorSelectTheme}
			{...props}
		/>
	);
};

export default ColorSelect;
