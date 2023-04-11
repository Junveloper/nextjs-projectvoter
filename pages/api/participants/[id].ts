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

	if (req.method === "PUT") {
		if (!id) {
			return res.status(400).json({ ok: false, error: "Missing fields" });
		}
		const participant = await client.participant.findFirstOrThrow({
			where: { id: Number(id) },
			include: { program: true },
		});
		if (participant.program.userId !== user.id) {
			return res.status(403).json({ ok: false, error: "Unauthorized" });
		}
		if (image && participant.image) {
			await deleteCfImage(participant.image);
		}
		const participantData = {
			name,
			summary,
			image,
			programId: participant.programId,
		};
		await client.participant.update({
			where: { id: Number(id) },
			data: { ...participantData },
		});
		return res.json({ ok: true });
	}

	if (req.method === "DELETE") {
		const participantId = req.query.id;
		const participant = await client.participant.findFirstOrThrow({
			where: { id: Number(participantId) },
			include: { program: true },
		});
		if (participant.program.userId !== user.id) {
			return res.status(403).json({ ok: false, error: "Unauthorized" });
		}
		if (participant.image) {
			await deleteCfImage(participant.image);
		}
		await client.participant.delete({ where: { id: participant.id } });
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["PUT", "DELETE"],
		handler,
	})
);
