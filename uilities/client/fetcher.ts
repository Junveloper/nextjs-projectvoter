import axios from "axios";

const apiClient = axios.create({
	baseURL: "/",
});

const fetcher = async (url: string) => {
	const response = await apiClient.get(url);
	return response.data;
};

export default fetcher;
