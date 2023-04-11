import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";
import { randomString } from "@/uilities/generalUtils";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "POST") {
		const {
			body: { quantity, programId },
			session: { user: userSession },
		} = req;
		if (!userSession?.id) {
			return res.json({ ok: false, message: "You are not logged in" });
		}
		const user = await client.user.findFirstOrThrow({
			where: { id: Number(userSession.id) },
		});
		const program = await client.program.findFirstOrThrow({
			where: { id: Number(programId) },
		});
		if (program.userId !== user.id) {
			return res.status(400).json({ ok: false, message: "Unauthorised" });
		}
		for (let i = 0; i < quantity; i++) {
			const uniqueKey = `${programId}-${randomString(4)}`;
			const votingTicketData = {
				programId: program.id,
				voteKey: uniqueKey,
				remainingVotes: program.defaultVoteCount,
			};
			await client.votingTicket.create({ data: votingTicketData });
		}
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
