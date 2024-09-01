"use client";
import ActiveLink from "../ActiveLink";

const ExportVKTopbar = () => {
	const activeBtnClass = "!bg-indigo-600 text-white";

	return (
		<div className="mb-8 flex flex-row">
			<div className="button-group">
				<ActiveLink href="/dashboard/export-vk" className="flex">
					{(isActive) => (
						<button
							className={`button-sm ${
								isActive ? activeBtnClass : ""
							}`}
						>
							Все выгрузки
						</button>
					)}
				</ActiveLink>
				<ActiveLink href="/dashboard/export-vk/create" className="flex">
					{(isActive) => (
						<button
							className={`button-sm ${
								isActive ? activeBtnClass : ""
							}`}
						>
							Создать новую
						</button>
					)}
				</ActiveLink>
			</div>
		</div>
	);
};

export default ExportVKTopbar;
