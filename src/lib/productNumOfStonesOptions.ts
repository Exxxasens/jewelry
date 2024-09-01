import { NumberOfStones } from "@prisma/client";

export interface NumOfStonesOption {
	value: NumberOfStones;
	label: string;
}

export const numOfStonesMap: Record<NumberOfStones, string> = {
	[NumberOfStones.One]: "1",
	[NumberOfStones.Two]: "2",
	[NumberOfStones.Three]: "3",
	[NumberOfStones.Four]: "4",
	[NumberOfStones.Five]: "5",
	[NumberOfStones.Six]: "6",
	[NumberOfStones.Scattering]: "Россыпь",
	[NumberOfStones.WithoutStones]: "Без камней",
};

const productNumOfStonesOptions: NumOfStonesOption[] = Object.entries(
	numOfStonesMap,
).map(([value, label]) => ({
	value: value as NumberOfStones,
	label,
}));

export default productNumOfStonesOptions;
