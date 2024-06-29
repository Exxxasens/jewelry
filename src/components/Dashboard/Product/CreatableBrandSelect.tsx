import CreatableSelect from "react-select/creatable";
import selectTheme from "~/lib/selectTheme";
import { api } from "~/trpc/react";

const CreatableBrandSelect = () => {
	const { isLoading, data } = api.brand.fetchBrands.useQuery();

	function transformData() {
		if (!data) {
			return [];
		}

		return data.map((brand) => {
			return {
				label: brand.name,
				value: brand.id,
			};
		});
	}

	return (
		<CreatableSelect
			{...selectTheme}
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
		/>
	);
};

export default CreatableBrandSelect;
