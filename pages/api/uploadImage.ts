import axios, { AxiosResponse } from "axios";

interface UploadURLReqestResponse {
	id: string;
	uploadURL: string;
}

interface CloudflareImageUploadResponse {
	result: {
		id: string;
		metadata: {
			[key: string]: string;
		};
		uploaded: string;
		requireSignedURLs: boolean;
		variants: string[];
		draft: boolean;
	};
	success: boolean;
	errors: string[];
	messages: string[];
}

export default async function uploadImage(file: File) {
	const urlRequest: AxiosResponse<UploadURLReqestResponse> = await axios.get(
		`/api/getUploadUrl`
	);
	const { uploadURL } = urlRequest.data;
	const form = new FormData();
	form.append("file", file);
	const {
		data: {
			result: { id },
		},
	}: AxiosResponse<CloudflareImageUploadResponse> = await axios.postForm(
		uploadURL,
		form
	);
	return id;
}
