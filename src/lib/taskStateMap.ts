import { TaskState } from "@prisma/client";

export type TaskStateMap = Record<TaskState, string>;

const taskStateMap = {
	[TaskState.Scheduled]: "Запланирована",
	[TaskState.Started]: "Выполняется",
	[TaskState.Finished]: "Закончена",
	[TaskState.Cancelled]: "Отменена",
} satisfies TaskStateMap;

export default taskStateMap;
