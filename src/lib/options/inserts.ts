import AvitoInsertsEnum from "../avito/insertsEnum";

export enum AdditionalInsertsEnum {
	Amazonite = "Amazonite",
	RoseQuartz = "RoseQuartz",
	Quartz = "Quartz",
	BlackOnyx = "BlackOnyx",
	WhiteMotherOfPearl = "WhiteMotherOfPearl",
	Spinel = "Spinel",
	Zircon = "Zircon",
	Malachite = "Malachite",
	Enamel = "Enamel",
	Dumortierite = "Dumortierite",
	Chalcedony = "Chalcedony",
	Rhodonite = "Rhodonite",
	Rhodolite = "Rhodolite",
	Steel = "Steel",
}

export type InsertType = AvitoInsertsEnum | AdditionalInsertsEnum;

export type InsertOption = {
	value: string | InsertType;
	label: string;
};

export type InsertMap = Record<InsertType, string>;

export const insertLabelsMap: InsertMap = {
	[AvitoInsertsEnum.Diamond]: "Бриллиант",
	[AvitoInsertsEnum.Fianit]: "Фианит",
	[AvitoInsertsEnum.Sapphire]: "Сапфир",
	[AvitoInsertsEnum.Emerald]: "Изумруд",
	[AvitoInsertsEnum.Pearl]: "Жемчуг",
	[AvitoInsertsEnum.Topaz]: "Топаз",
	[AvitoInsertsEnum.Amethyst]: "Аметист",
	[AvitoInsertsEnum.Amber]: "Янтарь",
	[AvitoInsertsEnum.Ruby]: "Рубин",
	[AvitoInsertsEnum.Alexandrite]: "Александрит",
	[AvitoInsertsEnum.Garnet]: "Гранат",
	[AvitoInsertsEnum.Without]: "Без вставок",
	[AvitoInsertsEnum.Other]: "Другое",

	// Дополнительные вставки
	[AdditionalInsertsEnum.Amazonite]: "Амазонит",
	[AdditionalInsertsEnum.RoseQuartz]: "Розовый кварц",
	[AdditionalInsertsEnum.Quartz]: "Кварц",
	[AdditionalInsertsEnum.BlackOnyx]: "Чёрный оникс",
	[AdditionalInsertsEnum.WhiteMotherOfPearl]: "Белый перламутр",
	[AdditionalInsertsEnum.Spinel]: "Шпинель",
	[AdditionalInsertsEnum.Zircon]: "Цирконы",
	[AdditionalInsertsEnum.Malachite]: "Малахит",
	[AdditionalInsertsEnum.Enamel]: "Эмаль",
	[AdditionalInsertsEnum.Dumortierite]: "Дюмортьерит",
	[AdditionalInsertsEnum.Chalcedony]: "Халцедон",
	[AdditionalInsertsEnum.Rhodonite]: "Родонит",
	[AdditionalInsertsEnum.Rhodolite]: "Родолит",
	[AdditionalInsertsEnum.Steel]: "Сталь",
};

const insertOptions: InsertOption[] = Object.entries(insertLabelsMap).map(
	([value, label]) => ({
		value: value,
		label,
	}),
);

export default insertOptions;
