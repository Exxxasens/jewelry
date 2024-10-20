import Select, {
	type GroupBase,
	type Props as SelectProps,
} from "react-select";
import productMaterialOptions, {
	type MaterialOption,
} from "~/lib/options/material";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";

type MaterialSelectProps = SelectProps<
	MaterialOption,
	false,
	GroupBase<MaterialOption>
>;

const MaterialSelect: React.FC<MaterialSelectProps> = (props) => {
	return (
		<Select
			isMulti={false}
			placeholder="Материал"
			isSearchable={true}
			options={productMaterialOptions}
			{...(selectTheme as SelectTheme<MaterialOption>)}
			{...props}
		/>
	);
};

export default MaterialSelect;
