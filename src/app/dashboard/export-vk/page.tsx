"use client";
import TaskStateTag from "~/components/Dashboard/ExportVK/TaskStateTag";
import { api } from "~/trpc/react";

const ExportVKPage = () => {
	const { data } = api.export.getExportTasks.useQuery({});

	return (
		<div>
			<div className="mb-8 text-2xl font-bold text-dark">
				Все выгрузки
			</div>
			<table className="w-full" cellPadding="0" cellSpacing="0">
				<thead>
					<tr>
						<th className="p-2 font-medium">Название задачи</th>
						<th className="p-2 font-medium">Статус</th>
						<th className="p-2 font-medium">Кол-во товаров</th>
						<th className="p-2 font-medium">Дата начала</th>
						<th className="p-2 font-medium">Дата завершения</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((task) => {
						return (
							<tr key={task.id}>
								<td className="td-base">
									<div className="td-div rounded-l-md">
										{task.name}
									</div>
								</td>

								<td className="td-base">
									<div className="td-div">
										<TaskStateTag tag={task.state} />
									</div>
								</td>

								<td className="td-base">
									<div className="td-div rounded-l-md">
										{task._count.products}
									</div>
								</td>
								<td className="td-base">
									<div className="td-div">
										{task.startedAt?.toLocaleString()}
									</div>
								</td>
								<td className="td-base">
									<div className="td-div rounded-r-md">
										{task.finishedAt?.toLocaleString()}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className="flex flex-col"></div>
		</div>
	);
};

export default ExportVKPage;
