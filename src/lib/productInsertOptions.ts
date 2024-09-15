import InsertsEnum from "./avito/insertsEnum";

export interface InsertDefaultOption {
	value: InsertsEnum;
	label: string;
}

export type InsertOption =
	| InsertDefaultOption
	| {
			value: string;
			label: string;
	  };

export const insertLabelsMap: Record<InsertsEnum, string> = {
	[InsertsEnum.Diamond]: "Бриллиант",
	[InsertsEnum.Fianit]: "Фианит",
	[InsertsEnum.Sapphire]: "Сапфир",
	[InsertsEnum.Emerald]: "Изумруд",
	[InsertsEnum.Pearl]: "Жемчуг",
	[InsertsEnum.Topaz]: "Топаз",
	[InsertsEnum.Amethyst]: "Аметист",
	[InsertsEnum.Amber]: "Янтарь",
	[InsertsEnum.Ruby]: "Рубин",
	[InsertsEnum.Alexandrite]: "Александрит",
	[InsertsEnum.Garnet]: "Гранат",
	[InsertsEnum.Without]: "Без вставок",
	[InsertsEnum.Other]: "Другое",
};

const productInsertOptions: InsertOption[] = Object.entries(
	insertLabelsMap,
).map(([value, label]) => ({
	value: value as InsertsEnum,
	label,
}));

export default productInsertOptions;
