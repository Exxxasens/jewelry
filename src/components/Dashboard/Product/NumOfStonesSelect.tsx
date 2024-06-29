import productNumOfStonesOptions from "~/lib/productNumOfStonesOptions";
import selectTheme from "~/lib/selectTheme";
import Select from "react-select";

const NumOfStonesSelect = () => {
	return (
		<Select
			isMulti={false}
			isClearable={true}
			placeholder="Цвет"
			isSearchable={true}
			options={productNumOfStonesOptions}
			{...selectTheme}
		/>
	);
};

export default NumOfStonesSelect;
