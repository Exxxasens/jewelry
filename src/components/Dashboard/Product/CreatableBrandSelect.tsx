import { type GroupBase } from "react-select";
import CreatableSelect, { type CreatableProps } from "react-select/creatable";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";
import { api } from "~/trpc/react";

interface BrandSelectOption {
	label: string;
	value: string;
}

type CreatableBrandSelectProps = CreatableProps<
	BrandSelectOption,
	false,
	GroupBase<BrandSelectOption>
>;

const CreatableBrandSelect: React.FC<CreatableBrandSelectProps> = (props) => {
	const { isLoading, data } = api.brand.fetchBrands.useQuery();

	function transformData() {
		if (!data) {
			return [];
		}

		return data.map((brand) => {
			return {
				label: brand.name,
				value: brand.name,
			};
		});
	}

	return (
		<CreatableSelect
			{...(selectTheme as SelectTheme<BrandSelectOption>)}
			isMulti={false}
			isClearable={true}
			placeholder="Название бренда"
			isSearchable={true}
			isLoading={isLoading}
			noOptionsMessage={() => (
				<div className="text-center font-medium text-dark/80">
					Нет доступных брендов. Добавьте новый бренд.
				</div>
			)}
			options={transformData()}
			formatCreateLabel={(creatable) => `Создать "${creatable}"`}
			{...props}
		/>
	);
};

export default CreatableBrandSelect;
