import productNumOfStonesOptions, {
	type NumOfStonesOption,
} from "~/lib/options/numOfStones";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";
import Select, {
	type GroupBase,
	type Props as SelectProps,
} from "react-select";

type NumOfStonesSelectProps = SelectProps<
	NumOfStonesOption,
	false,
	GroupBase<NumOfStonesOption>
>;

const NumOfStonesSelect: React.FC<NumOfStonesSelectProps> = (props) => {
	return (
		<Select
			isMulti={false}
			placeholder="Количество камней"
			isSearchable={true}
			options={productNumOfStonesOptions}
			{...(selectTheme as SelectTheme<NumOfStonesOption>)}
			{...props}
		/>
	);
};

export default NumOfStonesSelect;
