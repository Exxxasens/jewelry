import InsertsEnum from "./avito/insertsEnum";
import { insertLabelsMap } from "./productInsertOptions";

export function isInsertEnum(type: string): type is InsertsEnum {
	if (type in InsertsEnum) {
		return true;
	}
	return false;
}

export function formatInsert(type: string) {
	if (isInsertEnum(type)) {
		return insertLabelsMap[type];
	}
	return type;
}

export function formatInserts(
	inserts: {
		id: string;
		type: string;
	}[],
) {
	return inserts.map(({ type }) => formatInsert(type));
}
