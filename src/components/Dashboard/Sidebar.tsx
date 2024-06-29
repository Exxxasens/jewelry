"use client";
// import Logo from "../Logo";

import {
	FiBox,
	FiHome,
	FiPackage,
	FiLogOut,
	FiAlignJustify,
} from "react-icons/fi";
import ActiveLink from "./ActiveLink";
import Button from "./Button";

const Sidebar = () => {
	return (
		<div className="sticky top-0 flex h-full min-h-screen w-full max-w-xs flex-col bg-[#F5F6FA] p-8">
			<div className="flex w-full items-center justify-center">
				{/* <Logo textSize="text-3xl" /> */}
			</div>

			<div className="mt-8 flex flex-col gap-3">
				<div className="mb-2 flex font-semibold uppercase text-dark/80">
					Основное меню
				</div>
				<ActiveLink href="/dashboard">
					{(isActive) => (
						<Button
							icon={<FiHome />}
							active={isActive}
							type="button"
						>
							Главное
						</Button>
					)}
				</ActiveLink>

				<ActiveLink href="/dashboard/product" exact={false}>
					{(isActive) => (
						<Button
							icon={<FiBox />}
							type="button"
							active={isActive}
						>
							Склад
						</Button>
					)}
				</ActiveLink>

				<ActiveLink href="/dashboard/collection" exact={false}>
					{(isActive) => (
						<Button
							icon={<FiAlignJustify />}
							type="button"
							active={isActive}
						>
							Подборки
						</Button>
					)}
				</ActiveLink>
			</div>

			<div className="mt-6 flex flex-col gap-3">
				<div className="mb-2 flex font-semibold uppercase text-dark/80">
					Выгрузка
				</div>

				<ActiveLink href="/dashboard/import-avito" exact={false}>
					{(isActive) => (
						<Button
							icon={<FiPackage />}
							type="button"
							active={isActive}
						>
							Avito
						</Button>
					)}
				</ActiveLink>

				<Button icon={<FiPackage />}>VK</Button>
			</div>

			<Button icon={<FiLogOut />} className="mt-auto">
				Выход
			</Button>
		</div>
	);
};

export default Sidebar;
