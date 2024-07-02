export type TableDataType<T> = T & {
	key: string;
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
}

const Row = <SourceData extends object>({
	columns,
	data,
}: RowProps<SourceData>) => {
	const keys = getKeys(columns);
	return (
		<tr>
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
		</tr>
	);
};

export interface TableProps<Data> {
	columns: TableColumns<Data>;
	dataSource: TableDataType<Data>[];
	trClassNames?: string;
}

const Table = <SourceData extends object>({
	columns,
	dataSource,
	trClassNames,
}: TableProps<SourceData>) => {
	const keys = getKeys(columns);

	return (
		<table cellPadding={0} cellSpacing={0}>
			<thead>
				<tr className={`${trClassNames}`}>
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
				{dataSource.map((data) => (
					<Row key={data.key} columns={columns} data={data} />
				))}
			</tbody>
		</table>
	);
};

export default Table;
