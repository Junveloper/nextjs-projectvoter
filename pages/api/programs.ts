import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/uilities/server/prismaClient";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "POST") {
		const {
			body: { name, defaultVoteCount },
			session: { user: userSession },
		} = req;
		if (!userSession?.id) {
			return res
				.status(400)
				.json({ ok: false, error: "User is not logged in" });
		}
		const programData = {
			programName: name,
			defaultVoteCount: Number(defaultVoteCount),
			userId: userSession.id,
		};

		await client.program.create({
			data: { ...programData },
		});

		return res.json({
			ok: true,
		});
	}
	if (req.method === "GET") {
		const { user: userSession } = req.session;
		if (!userSession?.id) {
			return res
				.status(400)
				.json({ ok: false, error: "User is not logged in" });
		}
		const user = await client.user.findUnique({
			where: { id: userSession.id },
		});
		const programs = await client.program.findMany({
			where: {
				userId: user?.id,
			},
		});
		if (user?.currentProgramId) {
			const currentProgram = await client.program.findUnique({
				where: { id: user.currentProgramId },
				include: {
					participants: true,
				},
			});
			return res.json({
				ok: true,
				programs: programs,
				currentProgram: currentProgram,
			});
		} else {
			const currentProgram = await client.program.findFirst({
				where: { userId: user?.id },
			});
			return res.json({
				ok: true,
				programs: programs,
				currentProgram: currentProgram,
			});
		}
	}
}

export default withSession(
	withHandler({
		methods: ["POST", "GET"],
		handler,
	})
);
