import axios from "axios";

export default async function deleteCfImage(imageId: string) {
	try {
		const response = await axios.delete(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v1/${imageId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_TOKEN}`,
				},
			}
		);
	} catch (error) {
		console.error("Error deleting the image:", error);
	}
}
