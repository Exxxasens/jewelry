import Select from "react-select";
import productMaterialOptions from "~/lib/productMaterialOptions";
import selectTheme from "~/lib/selectTheme";

const MaterialSelect = () => {
	return (
		<Select
			isMulti={false}
			isClearable={true}
			placeholder="Цвет"
			isSearchable={true}
			options={productMaterialOptions}
			{...selectTheme}
		/>
	);
};

export default MaterialSelect;
