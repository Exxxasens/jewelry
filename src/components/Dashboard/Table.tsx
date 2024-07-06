import { useEffect, useState } from "react";
import { produce } from "immer";

export type TableDataType<T> = T & {
	key: string;
	_selected?: boolean;
};

export type TableColumns<T> = {
	[key in keyof T]: {
		title: string;
		tdClassNames?: string;
		thClassNames?: string;
		render: (
			data: T[key],
		) =>
			| string
			| number
			| React.ReactNode
			| React.ReactNode[]
			| JSX.Element;
	};
};

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export interface RowProps<Data> {
	columns: TableColumns<Data>;
	data: TableDataType<Data>;
	selection?: (
		toggle: () => void,
		selected: boolean,
		heading?: boolean,
	) => JSX.Element;
	selected: boolean;
	toggleSelect: () => void;
	tdSelectClassNames?: string;

	menu?: () => JSX.Element;
	tdMenuClassNames?: string;
}

const Row = <SourceData extends object>({
	columns,
	data,
	selection,
	selected,
	toggleSelect,
	tdSelectClassNames,
	menu,
	tdMenuClassNames,
}: RowProps<SourceData>) => {
	const keys = getKeys(columns);

	return (
		<tr>
			{/* {selection === "checkbox" && (
				<td>
					<input
						type="checkbox"
						onChange={toggleSelect}
						checked={selected}
					/>
				</td>
			)} */}
			{selection && (
				<td className={tdSelectClassNames}>
					{selection(toggleSelect, selected, false)}
				</td>
			)}
			{keys.map((key) => {
				const col = columns[key];
				return (
					<td
						key={`${col.title}-${data.key}`}
						className={col.tdClassNames}
					>
						{col.render(data[key])}
					</td>
				);
			})}

			{menu && <td className={tdMenuClassNames}>{menu()}</td>}
		</tr>
	);
};

export interface TableProps<Data> {
	columns: TableColumns<Data>;
	dataSource: TableDataType<Data>[];
	trClassNames?: string;
	selection?: (
		toggle: () => void,
		selected: boolean,
		heading?: boolean,
	) => JSX.Element;
	thSelectClassNames?: string;
	tdSelectClassNames?: string;

	menu?: () => JSX.Element;
	tdMenuClassNames?: string;
}

const Table = <SourceData extends object>({
	columns,
	dataSource,
	trClassNames,
	selection,
	thSelectClassNames,
	tdSelectClassNames,
	menu,
	tdMenuClassNames,
}: TableProps<SourceData>) => {
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [dataList, setDataList] = useState(dataSource);

	function toggleSelect(index: number) {
		setDataList(
			produce((draft) => {
				const item = draft[index];
				if (item) {
					item._selected = !item._selected;
				}
				return draft;
			}),
		);
	}

	useEffect(() => {
		for (const element of dataList) {
			if (!element._selected) {
				return setIsAllSelected(false);
			}
		}
		return setIsAllSelected(true);
	}, [dataList]);

	function toggleAll(selected: boolean) {
		setDataList(
			produce((draft) => {
				draft.forEach((item) => (item._selected = selected));
				return draft;
			}),
		);
	}

	useEffect(() => setDataList(dataSource), [dataSource]);

	const keys = getKeys(columns);

	return (
		<table cellPadding={0} cellSpacing={0}>
			<thead>
				<tr className={trClassNames}>
					{/* {selection === "checkbox" && (
						<th className={selectionClassNames}>
							<div>
								<input
									type="checkbox"
									checked={isAllSelected}
									onChange={() => toggleAll(!isAllSelected)}
									className="h-4 w-4"
								/>
							</div>
						</th>
					)} */}
					{selection && (
						<th className={thSelectClassNames}>
							{selection(
								() => toggleAll(!isAllSelected),
								isAllSelected,
								true,
							)}
						</th>
					)}

					{keys.map((key) => {
						const column = columns[key];
						return (
							<th
								key={column.title}
								className={`${column.thClassNames}`}
							>
								{column.title}
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{dataList.map((data, index) => (
					<Row
						key={data.key}
						columns={columns}
						data={data}
						selection={selection}
						toggleSelect={() => toggleSelect(index)}
						selected={data._selected ?? false}
						tdSelectClassNames={tdSelectClassNames}
						menu={menu}
						tdMenuClassNames={tdMenuClassNames}
					/>
				))}
			</tbody>
		</table>
	);
};

export default Table;
