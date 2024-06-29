import Select from "react-select";
import colorSelectTheme from "~/lib/colorSelectTheme";
import productColorOptions from "~/lib/productColorOptions";

const ColorSelect = () => {
	return (
		<Select
			isMulti={false}
			isClearable={true}
			placeholder="Цвет"
			isSearchable={true}
			options={productColorOptions}
			{...colorSelectTheme}
		/>
	);
};

export default ColorSelect;
