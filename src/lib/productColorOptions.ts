import { Color } from "@prisma/client";

export type ColorOption = {
	value: Color;
	label: string;
	style: string;
};

const productColorOptions: ColorOption[] = [
	{ value: Color.Gray, label: "Серый", style: "before:bg-[#9C9C9C]" },
	{ value: Color.Blue, label: "Синий", style: "before:bg-[#3264FA]" },
	{ value: Color.Beige, label: "Бежевый", style: "before:bg-[#CEC4AD]" },
	{ value: Color.Black, label: "Чёрный", style: "before:bg-[#292929]" },
	{ value: Color.Brown, label: "Коричневый", style: "before:bg-[#805C3A]" },
	{
		value: Color.White,
		label: "Белый",
		style: "before:bg-[#FFFFFF] before:border before:border-solid before:border-dark/20",
	},
	{ value: Color.Green, label: "Зелёный", style: "before:bg-[#1C8C38]" },
	{ value: Color.Red, label: "Красный", style: "before:bg-[#F54043]" },
	{ value: Color.Pink, label: "Розовый", style: "before:bg-[#FFA1EA]" },
	{
		value: Color.Multicolored,
		label: "Разноцветный",
		style: "before:multi-gradient",
	},
	{
		value: Color.Purple,
		label: "Фиолетовый",
		style: "before:bg-[#6A36E3]",
	},
	{
		value: Color.LightBlue,
		label: "Голубой",
		style: "before:bg-[#1CBFFF]",
	},
	{
		value: Color.Orange,
		label: "Оранжевый",
		style: "before:bg-[#FFB021]",
	},
	{
		value: Color.Yellow,
		label: "Жёлтый",
		style: "before:bg-[#FFE433]",
	},
	{
		value: Color.Silver,
		label: "Серебряный",
		style: "before:silver-gradient",
	},
	{
		value: Color.Gold,
		label: "Золотой",
		style: "before:gold-gradient",
	},
	{
		value: Color.Burgundy,
		label: "Бордовый",
		style: "before:bg-[#C71C3B]",
	},
];

export default productColorOptions;
