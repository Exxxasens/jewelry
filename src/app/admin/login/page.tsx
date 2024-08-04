"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn } from "next-auth/react";
import { redirect, RedirectType, useRouter } from "next/navigation";
import Head from "next/head";

const adminLoginSchema = zod.object({
	email: zod
		.string()
		.email("Некорректная почта")
		.min(1, { message: "Почта обязательна для ввода" }),
	password: zod.string().min(1, { message: "Пароль обязателен для ввода" }),
});

type AdminLoginValues = zod.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
		resolver: zodResolver(adminLoginSchema),
	});

	async function onSubmit({ email, password }: AdminLoginValues) {
		if (isSubmitting) {
			return;
		}

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		// reset form
		reset();

		if (result?.ok) {
			router.push("/dashboard");
		}

		if (result?.error) {
			return setError("password", {
				type: "custom",
				message: result.error,
			});
		}
	}

	return (
		<>
			<Head>
				<title>Избранное</title>
			</Head>
			<div className="flex w-full max-w-sm flex-col rounded-md bg-[#F2F1F0] px-6 py-8">
				<div className="flex w-full flex-row justify-center">
					<h1 className="m-0 mb-4 text-4xl font-bold">Авторизация</h1>
				</div>
				<div className="text-center text-sm font-semibold text-dark/90">
					Используйте ваши данные для авторизации в панель
					администратора
				</div>
				<form
					className="flex flex-col gap-2"
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onSubmit={handleSubmit(onSubmit)}
				>
					<label>
						<div className="mb-1 text-sm">Логин:</div>
						<input
							className="input-base w-full bg-white"
							placeholder="Почта"
							autoComplete="email"
							{...register("email")}
						/>
						<div className="error-container mt-2 text-sm">
							{errors.email?.message}
						</div>
					</label>
					<label>
						<div className="mb-1 text-sm">Пароль:</div>
						<input
							className="input-base w-full bg-white"
							type="password"
							placeholder="Пароль"
							autoComplete="password"
							{...register("password")}
						/>
						<div className="error-container mt-2 text-sm">
							{errors.password?.message}
						</div>
					</label>

					<button className="button-base mt-2 bg-dark" type="submit">
						Войти
					</button>
				</form>
			</div>
		</>
	);
};

export default AdminLogin;
