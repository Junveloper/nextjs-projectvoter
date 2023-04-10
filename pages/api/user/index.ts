import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "PATCH") {
		const {
			body: { programId },
			session: { user: userSession },
		} = req;
		if (!programId || !userSession?.id) {
			return res.status(400).json({ ok: false, error: "Missing fields" });
		}
		try {
			const user = await client.user.findFirstOrThrow({
				where: { id: Number(userSession.id) },
			});
			const program = await client.program.findFirstOrThrow({
				where: {
					id: Number(programId),
				},
			});
			if (program?.userId !== user?.id) {
				return res
					.status(403)
					.json({ ok: false, error: "Unauthorized" });
			}
			await client.user.update({
				where: { id: Number(userSession.id) },
				data: { currentProgramId: Number(programId) },
			});
			return res.json({
				ok: true,
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({ ok: false, error: error });
		}
	}
}

export default withSession(
	withHandler({
		methods: ["PATCH"],
		handler,
	})
);
