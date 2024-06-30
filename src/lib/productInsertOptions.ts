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

const productInsertOptions = [
	{ value: InsertsEnum.Diamond, label: "Бриллиант" },
	{ value: InsertsEnum.Fianit, label: "Фианит" },
	{ value: InsertsEnum.Sapphire, label: "Сапфир" },
	{ value: InsertsEnum.Emerald, label: "Изумруд" },
	{ value: InsertsEnum.Pearl, label: "Жемчуг" },
	{ value: InsertsEnum.Topaz, label: "Топаз" },
	{ value: InsertsEnum.Amethyst, label: "Аметист" },
	{ value: InsertsEnum.Amber, label: "Янтарь" },
	{ value: InsertsEnum.Ruby, label: "Рубин" },
	{ value: InsertsEnum.Alexandrite, label: "Александрит" },
	{ value: InsertsEnum.Garnet, label: "Гранат" },
	{ value: InsertsEnum.Without, label: "Без вставок" },
] satisfies InsertOption[];

export default productInsertOptions;
