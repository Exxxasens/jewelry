"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Controller,
	type DefaultValues,
	FormProvider,
	useForm,
} from "react-hook-form";
import productSchema, { type ProductSchema } from "~/lib/schemas/productSchema";
import Select from "react-select";
import selectTheme, { type SelectTheme } from "~/lib/selectTheme";
import { api } from "~/trpc/react";
import productCategoriesOptions, {
	type CategoriesOption,
} from "~/lib/productCategoriesOptions";
import CreatableBrandSelect from "../CreatableBrandSelect";
import ColorSelect from "../ColorSelect";
import MaterialSelect from "../MaterialSelect";
import Probe from "../Probe";
import productInsertOptions, {
	type InsertOption,
} from "~/lib/productInsertOptions";
import InsertSelect from "../InsertSelect";
import NumOfStonesSelect from "../NumOfStonesSelect";
import { NumericFormat } from "react-number-format";
import { type ChangeEvent } from "react";
import productNumOfStonesOptions from "~/lib/productNumOfStonesOptions";
import productMaterialOptions from "~/lib/productMaterialOptions";
import productColorOptions from "~/lib/productColorOptions";
import InsertsEnum from "~/lib/avito/insertsEnum";
import Uploader from "~/components/Uploader";

const resolver = zodResolver(productSchema);

interface ProductFormProps {
	defaultValues?: DefaultValues<ProductSchema>;
	onSubmit: (data: ProductSchema) => void;
}

const ProductFrom: React.FC<ProductFormProps> = ({
	defaultValues,
	onSubmit,
}) => {
	const methods = useForm<ProductSchema>({
		resolver,
		defaultValues: {
			sku: "",
			inserts: [],
			...defaultValues,
		},
	});

	const {
		register,
		control,
		formState: { errors },
		resetField,
		handleSubmit,
	} = methods;

	return (
		<FormProvider {...methods}>
			<form
				className="flex flex-row gap-6"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex w-full max-w-screen-lg flex-col gap-4">
					<div className="flex flex-col">
						<p className="card-heading label-required">
							Наименование:
						</p>
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
					<div className="flex flex-col">
						<p className="card-heading label-required">
							Категория:
						</p>
						<Controller
							name="category"
							control={control}
							render={({
								field: { value, onBlur, onChange },
							}) => {
								const selected = productCategoriesOptions.find(
									(v) => v.value === value,
								);
								return (
									<Select
										{...(selectTheme as SelectTheme<CategoriesOption>)}
										placeholder="Выберите категорию"
										options={productCategoriesOptions}
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
					<div className="flex flex-col">
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

					<h3 className="mt-4 text-xl font-semibold text-dark/90">
						Характеристики
					</h3>
					<div className="flex flex-col">
						<p className="card-heading">Цвет:</p>

						<Controller
							name="color"
							control={control}
							render={({
								field: { value, onBlur, onChange },
							}) => {
								const selected = productColorOptions.find(
									(option) => option.value === value,
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
					<div className="flex flex-col">
						<p className="card-heading">Материал:</p>
						<div className="flex flex-col gap-4">
							<Controller
								name="material"
								control={control}
								render={({
									field: { value, onBlur, onChange },
								}) => {
									const selected =
										productMaterialOptions.find(
											(option) => option.value === value,
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
							<Probe control={control} resetField={resetField} />
						</div>
						{errors.color?.message && (
							<p className="error-container ml-1 mt-2 text-sm">
								{errors.color?.message}
							</p>
						)}
					</div>

					<div className="flex flex-col">
						<div className="card-heading">Вставка:</div>

						<Controller
							name="inserts"
							control={control}
							render={({
								field: { value, onBlur, onChange },
							}) => {
								const selectedValues: InsertOption[] = [];

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

								function mapOptions(option: InsertOption) {
									return option.value;
								}

								return (
									<InsertSelect
										value={selectedValues}
										onBlur={onBlur}
										onChange={(option) =>
											onChange(option.map(mapOptions))
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
					<div className="flex flex-col">
						<p className="card-heading">Количество камней:</p>
						<Controller
							name="stones"
							control={control}
							render={({
								field: { value, onBlur, onChange },
							}) => {
								const selected = productNumOfStonesOptions.find(
									(option) => option.value === value,
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
					<h3 className="mt-4 text-xl font-semibold text-dark/90">
						Подробности
					</h3>
					<div className="flex flex-grow flex-col">
						<div className="card-heading label-required">
							Описание:
						</div>
						<textarea
							className="input-base flex h-full w-full flex-grow resize-none text-dark/80"
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

					<div className="card flex-row gap-4">
						<div className="flex-grow">
							<div className="card-heading label-required">
								Артикул:
							</div>

							<input
								className="input-base w-full"
								placeholder="Артикул"
								{...register("sku")}
							/>
							{errors.sku?.message && (
								<p className="error-container ml-1 mt-2 text-sm">
									{errors.sku?.message}
								</p>
							)}
						</div>

						<div className="flex-grow">
							<div className="card-heading label-required">
								Цена:
							</div>
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
											e.target.value.replaceAll(" ", "");
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
							<div className="card-heading">Цена до скидки:</div>

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
											e.target.value.replaceAll(" ", "");
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
							className="button-base border-none bg-dark/90 text-white"
						>
							Создать
						</button>
					</div>
				</div>
				<div className="w-full">
					<Controller
						name="media"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Uploader
								defaultValue={value}
								onChange={(images) => onChange(images)}
							/>
						)}
					/>
				</div>
			</form>
		</FormProvider>
	);
};

export default ProductFrom;
