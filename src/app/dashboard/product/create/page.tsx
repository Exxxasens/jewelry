"use client";
import { Controller, FormProvider, useForm } from "react-hook-form";
import productSchema, { type ProductSchema } from "~/lib/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import productCategoriesOptions, {
	type CategoriesOption,
} from "~/lib/productCategoriesOptions";
import Select from "react-select";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";
import CreatableBrandSelect from "~/components/Dashboard/Product/CreatableBrandSelect";
import ColorSelect from "~/components/Dashboard/Product/ColorSelect";
import MaterialSelect from "~/components/Dashboard/Product/MaterialSelect";
import InsertSelect from "~/components/Dashboard/Product/InsertSelect";
import NumOfStonesSelect from "~/components/Dashboard/Product/NumOfStonesSelect";
import { NumericFormat } from "react-number-format";
import Uploader from "~/components/Uploader";
import productColorOptions from "~/lib/productColorOptions";
import productMaterialOptions from "~/lib/productMaterialOptions";
import InsertsEnum from "~/lib/avito/insertsEnum";
import productInsertOptions, {
	type InsertOption,
} from "~/lib/productInsertOptions";
import productNumOfStonesOptions from "~/lib/productNumOfStonesOptions";
import Probe from "~/components/Dashboard/Product/Probe";
import { type ChangeEvent } from "react";
import { api } from "~/trpc/react";

const resolver = zodResolver(productSchema);

// TODO: refactor page...

const CreateProductPage = () => {
	const methods = useForm<ProductSchema>({
		resolver,
		defaultValues: {
			sku: "test",
			inserts: [],
		},
	});

	const {
		register,
		control,
		formState: { errors },
		resetField,
		handleSubmit,
	} = methods;

	const { mutateAsync } = api.product.create.useMutation();

	function onFormSubmit(data: ProductSchema) {
		mutateAsync(data)
			.then((data) => {
				console.log("submitted", data);
			})
			.catch((error) => console.log(error));
	}

	return (
		<div className="flex flex-col">
			<h2 className="mb-8 text-2xl font-bold text-dark">Новый товар</h2>
			<FormProvider {...methods}>
				<form
					className="flex flex-row gap-4"
					onSubmit={handleSubmit(onFormSubmit)}
				>
					<div className="flex w-full max-w-screen-lg flex-col gap-4">
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Наименование:</p>
								<input
									className="input-base"
									placeholder="Наименование товара"
									{...register("name")}
								/>
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Категория:</p>
								<Controller
									name="category"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selected =
											productCategoriesOptions.find(
												(v) => v.value === value,
											);
										return (
											<Select
												{...(selectTheme as SelectTheme<CategoriesOption>)}
												placeholder="Выберите категорию"
												options={
													productCategoriesOptions
												}
												isMulti={false}
												isClearable={true}
												isSearchable={true}
												value={selected}
												onBlur={onBlur}
												onChange={(option) =>
													onChange(option?.value)
												}
											/>
										);
									}}
								/>
								{errors.category?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.category?.message}
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Бренд:</p>

								<Controller
									name="brand"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selected = value
											? {
													value,
													label: value,
												}
											: undefined;

										return (
											<CreatableBrandSelect
												value={selected}
												onBlur={onBlur}
												onChange={(newValue) =>
													onChange(newValue?.value)
												}
											/>
										);
									}}
								/>

								{errors.brand?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.brand?.message}
									</p>
								)}
							</div>
						</div>

						<h3 className="mt-4 text-xl font-semibold text-dark/90">
							Характеристики
						</h3>
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Цвет:</p>

								<Controller
									name="color"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selected =
											productColorOptions.find(
												(option) =>
													option.value === value,
											);
										return (
											<ColorSelect
												value={selected}
												onBlur={onBlur}
												onChange={(option) =>
													onChange(option?.value)
												}
											/>
										);
									}}
								/>

								{errors.color?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.color?.message}
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Материал:</p>
								<Controller
									name="material"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selected =
											productMaterialOptions.find(
												(option) =>
													option.value === value,
											);
										return (
											<MaterialSelect
												value={selected}
												onBlur={onBlur}
												onChange={(option) =>
													onChange(option?.value)
												}
											/>
										);
									}}
								/>
								{errors.color?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.color?.message}
									</p>
								)}
								<div className="mt-4">
									<Probe
										control={control}
										resetField={resetField}
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">Вставка:</p>

								<Controller
									name="inserts"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selectedValues: InsertOption[] =
											[];

										value.forEach((v) => {
											if (v in InsertsEnum) {
												const foundOption =
													productInsertOptions.find(
														(option) =>
															// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
															option.value === v,
													);
												if (foundOption)
													return selectedValues.push(
														foundOption,
													);
											}

											return selectedValues.push({
												value: v,
												label: v,
											});
										});

										function mapOptions(
											option: InsertOption,
										) {
											return option.value;
										}

										return (
											<InsertSelect
												value={selectedValues}
												onBlur={onBlur}
												onChange={(option) =>
													onChange(
														option.map(mapOptions),
													)
												}
											/>
										);
									}}
								/>

								{errors.inserts?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.inserts?.message}
									</p>
								)}
							</div>
						</div>
						<div className="flex flex-col">
							<div className="card">
								<p className="card-heading">
									Количество камней:
								</p>
								<Controller
									name="stones"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										const selected =
											productNumOfStonesOptions.find(
												(option) =>
													option.value === value,
											);
										return (
											<NumOfStonesSelect
												value={selected}
												onBlur={onBlur}
												onChange={(option) =>
													onChange(option?.value)
												}
											/>
										);
									}}
								/>
								{errors.stones?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.stones?.message}
									</p>
								)}
							</div>
						</div>
						<h3 className="mt-4 text-xl font-semibold text-dark/90">
							Подробности
						</h3>
						<div className="flex flex-col">
							<div className="card flex-grow">
								<div className="card-heading">Описание:</div>
								<textarea
									className="input-base flex h-full w-full flex-grow resize-none"
									cols={40}
									rows={6}
									placeholder="Описание товара"
									{...register("description")}
								/>
								{errors.description?.message && (
									<div className="error-container ml-1 mt-2 text-sm">
										{errors.description?.message}
									</div>
								)}
							</div>
						</div>

						<div className="card flex-row gap-4">
							<div className="flex-grow">
								<div className="card-heading">Цена:</div>
								<Controller
									name="price"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										function handleChange(
											e: ChangeEvent<HTMLInputElement>,
										) {
											const stringToParse =
												e.target.value.replaceAll(
													" ",
													"",
												);
											onChange(parseFloat(stringToParse));
										}

										return (
											<NumericFormat
												className="input-base w-full"
												thousandSeparator=" "
												suffix=" ₽"
												placeholder="Цена, руб."
												value={value}
												onChange={handleChange}
												onBlur={onBlur}
											/>
										);
									}}
								/>

								{errors.price?.message && (
									<div className="error-container ml-1 mt-2 text-sm">
										{errors.price?.message}
									</div>
								)}
							</div>
							<div className="flex-grow">
								<div className="card-heading">
									Цена до скидки:
								</div>

								<Controller
									name="oldPrice"
									control={control}
									render={({
										field: { value, onBlur, onChange },
									}) => {
										function handleChange(
											e: ChangeEvent<HTMLInputElement>,
										) {
											const stringToParse =
												e.target.value.replaceAll(
													" ",
													"",
												);
											onChange(parseFloat(stringToParse));
										}

										return (
											<NumericFormat
												className="input-base w-full"
												thousandSeparator=" "
												suffix=" ₽"
												placeholder="Цена до скидки, руб."
												value={value}
												onChange={handleChange}
												onBlur={onBlur}
											/>
										);
									}}
								/>

								{errors.oldPrice?.message && (
									<div className="error-container ml-1 mt-2 text-sm">
										{errors.oldPrice?.message}
									</div>
								)}
							</div>
						</div>
						<div className="flex">
							<button
								type="submit"
								className="button-sm bg-[#F5F6FA]"
							>
								Создать
							</button>
						</div>
					</div>
					<div className="w-full">
						<Controller
							name="media"
							control={control}
							render={({ field: { onChange } }) => (
								<Uploader
									onChange={(images) => onChange(images)}
								/>
							)}
						/>
					</div>
				</form>
			</FormProvider>
		</div>
	);
};

export default CreateProductPage;
