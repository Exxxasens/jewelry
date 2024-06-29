"use client";
import { Controller, FormProvider, useForm } from "react-hook-form";
import productSchema, { type ProductSchema } from "~/lib/schemas/productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import productCategoriesOptions from "~/lib/productCategoriesOptions";
import Select from "react-select";
import selectTheme from "~/lib/selectTheme";
import CreatableBrandSelect from "~/components/Dashboard/Product/CreatableBrandSelect";
import ColorSelect from "~/components/Dashboard/Product/ColorSelect";
import MaterialSelect from "~/components/Dashboard/Product/MaterialSelect";
import InsertSelect from "~/components/Dashboard/Product/InsertSelect";
import NumOfStonesSelect from "~/components/Dashboard/Product/NumOfStonesSelect";
import { NumericFormat } from "react-number-format";
import Uploader from "~/components/Uploader";

const resolver = zodResolver(productSchema);

const CreateProductPage = () => {
	const methods = useForm<ProductSchema>({
		resolver,
		defaultValues: {},
	});

	const {
		register,
		control,
		formState: { errors },
	} = methods;

	return (
		<div className="flex flex-col">
			<h2 className="mb-8 text-2xl font-bold text-dark/90">
				Новый товар
			</h2>

			<FormProvider {...methods}>
				<form className="flex flex-row gap-4">
					<div className="flex w-full max-w-screen-lg flex-col gap-4">
						<div className="flex flex-col">
							<label className="card">
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
							</label>
						</div>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">Категория:</p>
								<Select
									{...selectTheme}
									placeholder="Выберите категорию"
									options={productCategoriesOptions}
									isMulti={false}
									isClearable={true}
									isSearchable={true}
								/>
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">Бренд:</p>
								<CreatableBrandSelect />
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>

						<h3 className="mt-4 text-xl font-semibold text-dark/90">
							Характеристики
						</h3>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">Цвет:</p>
								<ColorSelect />
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">Материал:</p>
								<MaterialSelect />
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">Вставка:</p>
								<InsertSelect />
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>
						<div className="flex flex-col">
							<label className="card">
								<p className="card-heading">
									Количество камней:
								</p>
								<NumOfStonesSelect />
								{errors.name?.message && (
									<p className="error-container ml-1 mt-2 text-sm">
										{errors.name?.message}
									</p>
								)}
							</label>
						</div>
						<h3 className="mt-4 text-xl font-semibold text-dark/90">
							Подробности
						</h3>
						<div className="flex flex-col">
							<label className="card flex-grow">
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
							</label>
						</div>

						<div className="card flex-row gap-4">
							<label className="flex-grow">
								<div className="card-heading">Цена:</div>
								<NumericFormat
									className="input-base w-full"
									thousandSeparator=" "
									suffix=" ₽"
								/>
								{errors.description?.message && (
									<div className="error-container ml-1 mt-2 text-sm">
										{errors.description?.message}
									</div>
								)}
							</label>
							<label className="flex-grow">
								<div className="card-heading">
									Цена до скидки:
								</div>
								<NumericFormat
									className="input-base w-full"
									thousandSeparator=" "
									suffix=" ₽"
									placeholder="Цена до скидки, руб."
								/>
								{errors.description?.message && (
									<div className="error-container ml-1 mt-2 text-sm">
										{errors.description?.message}
									</div>
								)}
							</label>
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
