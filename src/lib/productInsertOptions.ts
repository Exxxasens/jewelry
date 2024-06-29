import { Inserts } from "@prisma/client";

const productInsertOptions = [
	{ value: Inserts.Diamond, label: "Бриллиант" },
	{ value: Inserts.Fianit, label: "Фианит" },
	{ value: Inserts.Sapphire, label: "Сапфир" },
	{ value: Inserts.Emerald, label: "Изумруд" },
	{ value: Inserts.Pearl, label: "Жемчуг" },
	{ value: Inserts.Topaz, label: "Топаз" },
	{ value: Inserts.Amethyst, label: "Аметист" },
	{ value: Inserts.Amber, label: "Янтарь" },
	{ value: Inserts.Ruby, label: "Рубин" },
	{ value: Inserts.Alexandrite, label: "Александрит" },
	{ value: Inserts.Garnet, label: "Гранат" },
	{ value: Inserts.Other, label: "Другое" },
	{ value: Inserts.Without, label: "Без вставок" },
];

export default productInsertOptions;
