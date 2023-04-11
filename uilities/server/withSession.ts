import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
	interface IronSessionData {
		user?: {
			id: number;
		};
		ticket?: {
			id: number;
			voteKey: string;
			programId: number;
			remainingVotes: number;
		};
	}
}

const cookieOptions = {
	cookieName: "projectvoter",
	password: process.env.COOKIE_ENCRYPT_PASSWORD!,
};

export function withSession(fn: any) {
	return withIronSessionApiRoute(fn, cookieOptions);
}
