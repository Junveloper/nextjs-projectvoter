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
			return res.status(400).json({ ok: false, message: "No ticket" });
		}
		const votingTicket = await client.votingTicket.findUnique({
			where: { id: Number(ticket.id) },
			include: {
				program: {
					include: {
						participants: {
							include: {
								votes: {
									where: {
										votingTicketId: Number(ticket.id),
									},
								},
							},
						},
					},
				},
			},
		});
		if (!votingTicket) {
			return res.status(400).json({ ok: false, message: "No ticket" });
		}

		votingTicket.program.participants =
			votingTicket.program.participants.map((participant) => {
				return {
					...participant,
					voted: participant.votes.length > 0,
				};
			});

		return res.json({ ok: true, votingTicket });
	}
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
