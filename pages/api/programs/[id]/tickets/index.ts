import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		const {
			query: { id },
			session: { user: userSession },
		} = req;

		if (!id || !userSession?.id) {
			return res
				.status(400)
				.json({ ok: false, error: "Invalid request" });
		}
		const user = await client.user.findFirstOrThrow({
			where: { id: Number(userSession.id) },
		});
		const program = await client.program.findFirstOrThrow({
			where: { id: Number(id) },
			include: { votingTickets: true },
		});
		if (user.id !== program.userId) {
			return res.status(403).json({
				ok: false,
				error: "You are not authorized to do this",
			});
		}
		return res.json({
			ok: true,
			program,
		});
	}
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
