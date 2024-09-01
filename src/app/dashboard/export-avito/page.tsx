"use client";

import { TaskType } from "@prisma/client";
import Link from "next/link";
import TaskStateTag from "~/components/Dashboard/ExportVK/TaskStateTag";
import { api } from "~/trpc/react";

const ExportAvitoPage = () => {
	const { data } = api.export.getExportTasks.useQuery({
		type: TaskType.ExportAvito,
	});

	return (
		<div>
			<div className="heading-2xl">Все выгрузки</div>
			<table className="w-full" cellPadding="0" cellSpacing="0">
				<thead>
					<tr>
						<th className="p-2 font-medium">Название задачи</th>
						<th className="p-2 font-medium">Ссылка</th>
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
										<Link
											href={`/api/avito-xml/${task.id}`}
											target="_blank"
										>
											<button
												className="button-sm"
												type="button"
											>
												Загрузить
											</button>
										</Link>
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

export default ExportAvitoPage;
