import Select from "react-select";
import productInsertOptions from "~/lib/productInsertOptions";
import selectTheme from "~/lib/selectTheme";

const InsertSelect = () => {
	return (
		<Select
			isMulti={true}
			isClearable={true}
			placeholder="Вставка"
			isSearchable={true}
			options={productInsertOptions}
			{...selectTheme}
		/>
	);
};

export default InsertSelect;
