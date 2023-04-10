import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		const { user } = req.session;
		if (!user) {
			res.json({
				ok: false,
				error: "User is not logged in",
			});
			return res.status(200).end();
		}
		const userProfile = await client.user.findUnique({
			where: { id: req.session.user?.id },
			select: {
				id: true,
				name: true,
				email: true,
				currentProgramId: true,
			},
		});
		return res.json({
			ok: true,
			user: userProfile,
		});
	}
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
