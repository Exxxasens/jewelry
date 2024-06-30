import { NumberOfStones } from "@prisma/client";

export interface NumOfStonesOption {
	value: NumberOfStones;
	label: string;
}

const productNumOfStonesOptions = [
	{ value: NumberOfStones.One, label: "1" },
	{ value: NumberOfStones.Two, label: "2" },
	{ value: NumberOfStones.Three, label: "3" },
	{ value: NumberOfStones.Four, label: "4" },
	{ value: NumberOfStones.Five, label: "5" },
	{ value: NumberOfStones.Six, label: "6" },
	{ value: NumberOfStones.Scattering, label: "Россыпь" },
	{ value: NumberOfStones.WithoutStones, label: "Без камней" },
] satisfies NumOfStonesOption[];

export default productNumOfStonesOptions;
