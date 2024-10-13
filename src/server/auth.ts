import { PrismaAdapter } from "@auth/prisma-adapter";
import {
	getServerSession,
	type DefaultSession,
	type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import CredentialsException from "./exceptions/CredentialsException";
import { type Adapter } from "next-auth/adapters";
import { db } from "~/server/db";
import { UserRole } from "@prisma/client";
import { env } from "~/env";
import bcryptjs from "bcryptjs";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			role: UserRole;
		} & DefaultSession["user"];
	}
	interface User {
		role: UserRole;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	secret: env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/client/login",
		verifyRequest: "/client/verify",
		error: "/client/login",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					id: token.id as string,
					role: token.role as UserRole,
					email: token.email,
				},
			};
		},
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = user.role;
			}
			return token;
		},
	},
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "Your Email",
				},
				password: {
					label: "Password",
					required: true,
					type: "password",
				},
			},
			async authorize(credentials) {
				const { email, password } = credentials as {
					email: string;
					password: string;
				};

				if (!email || !password) {
					throw new CredentialsException();
				}

				const user = await db.user.findFirst({
					where: {
						email,
						role: UserRole.Admin,
					},
					select: {
						id: true,
						email: true,
						password: true,
						role: true,
					},
				});

				if (!user?.password) {
					throw new CredentialsException();
				}

				const compareResult = await bcryptjs.compare(
					password,
					user.password,
				);

				if (!compareResult) {
					throw new CredentialsException();
				}

				return user;
			},
		}),
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
