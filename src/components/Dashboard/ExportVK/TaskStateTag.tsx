import { TaskState } from "@prisma/client";
import taskStateMap, { type TaskStateMap } from "~/lib/taskStateMap";

interface TaskStateTagProps {
	tag: TaskState;
}

const taskStateStyles = {
	[TaskState.Scheduled]: "bg-indigo-300 text-white",
	[TaskState.Started]: "bg-blue-300 text-white",
	[TaskState.Finished]: "bg-violet-500 text-white",
	[TaskState.Cancelled]: "bg-red-500 text-white",
} satisfies TaskStateMap;

const TaskStateTag: React.FC<TaskStateTagProps> = ({ tag }) => {
	return (
		<div className={`tag ${taskStateStyles[tag]}`}>{taskStateMap[tag]}</div>
	);
};

export default TaskStateTag;
