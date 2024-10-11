import { type GroupBase } from "react-select";
import AsyncCreatableSelect, {
	type AsyncCreatableProps,
} from "react-select/async-creatable";
import productInsertOptions, { type InsertOption } from "~/lib/options/inserts";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";

type InsertSelectProps = AsyncCreatableProps<
	InsertOption,
	true,
	GroupBase<InsertOption>
>;

const InsertSelect: React.FC<InsertSelectProps> = (props) => {
	return (
		<AsyncCreatableSelect
			isSearchable={true}
			isMulti={true}
			isClearable={true}
			placeholder="Вставка"
			defaultOptions={productInsertOptions}
			{...(selectTheme as SelectTheme<InsertOption>)}
			{...props}
		/>
	);
};

export default InsertSelect;
