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
			body: { email, password },
			session: { user: userSession },
		} = req;

		if (userSession?.id) {
			return res
				.status(400)
				.json({ ok: false, error: "User is already logged in" });
		}
		if (!email || !password) {
			return res.status(400).json({ ok: false, error: "Missing fields" });
		}

		const user = await client.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			return res.status(400).json({
				ok: false,
				error: "Incorrect email or password combination",
			});
		}

		const passwordMatch = await bcrpyt.compare(password, user?.password);
		if (!passwordMatch) {
			return res.status(400).json({
				ok: false,
				error: "Incorrect email or password combination",
			});
		}

		const userId = user.id;
		req.session.user = { id: userId };
		await req.session.save();
		return res.json({ ok: true, userId });
	}
}

export default withSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
