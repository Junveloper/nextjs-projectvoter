import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import withHandler, { ResponseType } from "@/uilities/server/withHandler";
import { withSession } from "@/uilities/server/withSession";

interface CloudflareUploadResponse {
	result: {
		id: string;
		uploadURL: string;
	};
	result_info: null | string;
	success: boolean;
	errors: string[];
	messages: string[];
}
async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseType>
) {
	const data = new URLSearchParams();
	const urlRequestResponse: AxiosResponse<CloudflareUploadResponse> =
		await axios.post(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
			data,
			{
				headers: {
					Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_TOKEN}`,
				},
			}
		);
	return res.json({ ok: true, ...urlRequestResponse.data.result });
}

export default withSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
