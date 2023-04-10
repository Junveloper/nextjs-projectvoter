import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
	ok: boolean;
	[key: string]: any;
}

type method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

interface ConfigType {
	methods: method[];
	handler: (req: NextApiRequest, res: NextApiResponse) => void;
	isPublic?: boolean;
}

export default function withHandler({
	methods,
	handler,
	isPublic = true,
}: ConfigType) {
	return async function (
		req: NextApiRequest,
		res: NextApiResponse
	): Promise<any> {
		if (req.method && !methods.includes(req.method as any)) {
			return res.status(405).end();
		}
		if (!isPublic && !req.session.user) {
			return res
				.status(401)
				.json({ ok: false, error: "User is not logged in" });
		}
		try {
			await handler(req, res);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	};
}
