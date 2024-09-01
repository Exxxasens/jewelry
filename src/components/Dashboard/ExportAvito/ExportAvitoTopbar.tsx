"use client";
import ActiveLink from "../ActiveLink";

const ExportAvitoTopbar = () => {
	const activeBtnClass = "!bg-indigo-600 text-white";

	return (
		<div className="mb-8 flex flex-row">
			<div className="button-group">
				<ActiveLink href="/dashboard/export-avito" className="flex">
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
				<ActiveLink
					href="/dashboard/export-avito/create"
					className="flex"
				>
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

export default ExportAvitoTopbar;
