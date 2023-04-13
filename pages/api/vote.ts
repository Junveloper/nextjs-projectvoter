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
			body: { participantId },
			session: { ticket },
		} = req;
		if (!participantId || !ticket) {
			return res
				.status(400)
				.json({ ok: false, error: "No participantId or votingTicket" });
		}

		const votingTicket = await client.votingTicket.findFirstOrThrow({
			where: { id: Number(ticket.id) },
		});

		const participant = await client.participant.findUnique({
			where: { id: Number(participantId) },
			include: {
				votes: {
					where: { votingTicketId: votingTicket.id },
				},
			},
		});

		if (!participant || !votingTicket) {
			return res.status(400).json({
				ok: false,
				error: "Invalid participant or votingTicket",
			});
		}

		if (votingTicket.remainingVotes <= 0) {
			return res.status(400).json({ ok: false, error: "No votes left" });
		}

		if (participant.votes.length > 0) {
			return res.status(400).json({
				ok: false,
				error: "Already voted on this participant",
			});
		}

		await client.vote.create({
			data: {
				participantId: Number(participantId),
				votingTicketId: Number(ticket.id),
			},
		});
		await client.votingTicket.update({
			where: { id: Number(ticket.id) },
			data: {
				remainingVotes: {
					decrement: 1,
				},
			},
		});
		return res.json({ ok: true });
	}
	if (req.method === "PATCH") {
		const {
			body: { participantId },
			session: { ticket },
		} = req;
		if (!participantId || !ticket) {
			return res
				.status(400)
				.json({ ok: false, error: "No participantId or votingTicket" });
		}

		const votingTicket = await client.votingTicket.findFirstOrThrow({
			where: { id: Number(ticket.id) },
		});

		const participant = await client.participant.findUnique({
			where: { id: Number(participantId) },
			include: {
				votes: {
					where: { votingTicketId: votingTicket.id },
				},
			},
		});

		if (!participant || !votingTicket) {
			return res.status(400).json({
				ok: false,
				error: "Invalid participant or votingTicket",
			});
		}

		if (!participant.votes[0]) {
			return res.status(400).json({
				ok: false,
				error: "No vote was casted on this group",
			});
		}

		await client.vote.delete({
			where: {
				id: participant.votes[0].id,
			},
		});

		await client.votingTicket.update({
			where: { id: Number(ticket.id) },
			data: {
				remainingVotes: {
					increment: 1,
				},
			},
		});

		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["POST", "PATCH"],
		handler,
	})
);
