import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";
import deleteCfImage from "@/uilities/server/deleteCfImage";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const {
		body: { name, summary, image, programId, id },
		session: { user: userSession },
	} = req;
	const user = await client.user.findFirstOrThrow({
		where: { id: userSession?.id },
	});

	if (req.method === "POST") {
		const program = await client.program.findFirstOrThrow({
			where: { id: Number(programId) },
		});
		if (program.userId !== user.id) {
			return res.status(403).json({ ok: false, error: "Unauthorized" });
		}
		const participantData = {
			name,
			summary,
			image,
			programId: program.id,
		};
		await client.participant.create({
			data: { ...participantData },
		});
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
