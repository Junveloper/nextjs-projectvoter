import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";
import deleteCfImage from "@/uilities/server/deleteCfImage";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "DELETE") {
		const {
			query: { id },
			session: { user: userSession },
		} = req;
		if (!id || !userSession) {
			return res.status(400).json({
				ok: false,
				error: "Missing program id or user is not logged in",
			});
		}
		const user = await client.user.findFirstOrThrow({
			where: { id: userSession.id },
		});
		const program = await client.program.findFirstOrThrow({
			where: { id: Number(id) },
			include: { participants: true },
		});

		if (program.userId !== user.id) {
			return res
				.status(400)
				.json({ ok: false, error: "User does not own this program" });
		}

		if (program.participants.length > 0) {
			program.participants.forEach(async (participant) => {
				if (participant.image) {
					await deleteCfImage(participant.image);
				}
			});
		}

		await client.user.update({
			where: { id: user.id },
			data: { currentProgramId: null },
		});

		await client.program.delete({
			where: { id: Number(id) },
		});

		return res.json({ ok: true });
	}

	if (req.method === "PATCH") {
		const {
			body: { id, name, defaultVoteCount },
			session: { user: userSession },
		} = req;
		if (!id || !userSession) {
			return res.status(400).json({
				ok: false,
				error: "Missing fields",
			});
		}
		const user = await client.user.findFirstOrThrow({
			where: { id: userSession.id },
		});
		const program = await client.program.findFirstOrThrow({
			where: { id: Number(id) },
			include: { votingTickets: true },
		});
		if (program.userId !== user.id) {
			return res
				.status(403)
				.json({ ok: false, error: "User does not own this program" });
		}
		if (name && program.programName !== name) {
			await client.program.update({
				where: { id: Number(id) },
				data: {
					programName: name,
				},
			});
		}
		if (
			defaultVoteCount &&
			program.defaultVoteCount !== Number(defaultVoteCount)
		) {
			await client.program.update({
				where: { id: Number(id) },
				data: {
					defaultVoteCount: Number(defaultVoteCount),
				},
			});
			const difference =
				Number(defaultVoteCount) - program.defaultVoteCount;
			await client.votingTicket.updateMany({
				data: {
					remainingVotes: {
						increment: difference,
					},
				},
			});
		}
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["DELETE", "PATCH"],
		handler,
	})
);
