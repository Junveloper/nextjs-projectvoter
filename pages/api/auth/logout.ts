import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	if (req.method === "GET") {
		req.session.destroy();
		return res.json({ ok: true });
	}
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
