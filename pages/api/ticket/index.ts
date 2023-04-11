import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		const { ticket } = req.session;
		if (!ticket) {
			res.json({
				ok: false,
				error: "The user has not registered a voting ticket",
			});
			return res.status(200).end();
		}
		const votingTicket = await client.votingTicket.findUnique({
			where: { id: Number(ticket.id) },
			select: {
				id: true,
				voteKey: true,
				programId: true,
				remainingVotes: true,
			},
		});

		return res.json({
			ok: true,
			votingTicket: votingTicket,
		});
	}
	if (req.method === "POST") {
		const { voteKey } = req.body;
		if (!voteKey) {
			return res
				.status(400)
				.json({ ok: false, error: "Insufficient field" });
		}
		const votingTicket = await client.votingTicket.findUnique({
			where: { voteKey: voteKey },
		});
		if (!votingTicket) {
			return res
				.status(400)
				.json({ ok: false, error: "Invalid vote key" });
		}
		req.session.ticket = votingTicket;
		await req.session.save();
		return res.json({ ok: true, ticket: votingTicket });
	}
}

export default withSession(
	withHandler({
		methods: ["GET", "POST"],
		handler,
	})
);
