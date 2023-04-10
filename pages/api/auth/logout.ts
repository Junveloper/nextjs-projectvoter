import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		const { user } = req.session;
		if (!user) {
			res.json({
				ok: false,
				error: "User is not logged in",
			});
			return res.status(200).end();
		}
		req.session.user = undefined;
		await req.session.save();
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
