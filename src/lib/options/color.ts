import { Color } from "@prisma/client";

export type ColorOption = {
	value: Color;
	label: string;
	style: string;
};

const ColorStyles = {
	Gray: "before:bg-[#9C9C9C]",
	Blue: "before:bg-[#3264FA]",
	Beige: "before:bg-[#CEC4AD]",
	Black: "before:bg-[#292929]",
	Brown: "before:bg-[#805C3A]",
	White: "before:bg-[#FFFFFF] before:border before:border-solid before:border-dark/20",
	Green: "before:bg-[#1C8C38]",
	Red: "before:bg-[#F54043]",
	Pink: "before:bg-[#FFA1EA]",
	Multicolored: "before:multi-gradient",
	Purple: "before:bg-[#6A36E3]",
	LightBlue: "before:bg-[#1CBFFF]",
	Orange: "before:bg-[#FFB021]",
	Yellow: "before:bg-[#FFE433]",
	Silver: "before:silver-gradient",
	Gold: "before:gold-gradient",
	Burgundy: "before:bg-[#C71C3B]",
} as const;

const colorOptions: ColorOption[] = Object.entries(ColorStyles).map(
	([color, style]) => ({
		value: Color[color as keyof typeof Color],
		label: getColorLabel(color as keyof typeof Color),
		style,
	}),
);

export function getColorLabel(color: keyof typeof Color): string {
	const colorLabels: Record<keyof typeof Color, string> = {
		Gray: "Серый",
		Blue: "Синий",
		Beige: "Бежевый",
		Black: "Чёрный",
		Brown: "Коричневый",
		White: "Белый",
		Green: "Зелёный",
		Red: "Красный",
		Pink: "Розовый",
		Multicolored: "Разноцветный",
		Purple: "Фиолетовый",
		LightBlue: "Голубой",
		Orange: "Оранжевый",
		Yellow: "Жёлтый",
		Silver: "Серебряный",
		Gold: "Золотой",
		Burgundy: "Бордовый",
	};

	return colorLabels[color];
}

export default colorOptions;
