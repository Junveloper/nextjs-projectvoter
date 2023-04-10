import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";
import bcrpyt from "bcrypt";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "POST") {
		const {
			body: { name, email, password, confirmPassword },
			session: { user: userSession },
		} = req;

		if (userSession?.id) {
			return res
				.status(400)
				.json({ ok: false, error: "User is already logged in" });
		}
		if (!name || !email || !password || !confirmPassword) {
			return res.status(400).json({ ok: false, error: "Missing fields" });
		}
		if (password !== confirmPassword) {
			return res
				.status(400)
				.json({ ok: false, error: "Passwords do not match" });
		}

		const userExists = await client.user.findUnique({
			where: {
				email: email,
			},
		});

		if (userExists) {
			return res.status(400).json({
				ok: false,
				error: "User with this email already exists",
			});
		}
		const userData = {
			name: name,
			email: email,
			password: await bcrpyt.hash(password, 10),
		};

		await client.user.create({
			data: { ...userData },
		});

		res.status(200).json({
			ok: true,
			message: "User has been created successfully",
		});
	}
}

export default withSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
