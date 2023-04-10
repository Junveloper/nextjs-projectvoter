import { useState } from "react";
import axios, { AxiosError } from "axios";

interface UsePostUtilityState<T> {
	isLoading: boolean;
	data?: T;
	error?: AxiosError;
}

interface PostUtilityOptions<T> {
	method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
	multipart?: boolean;
	body: T;
}

type PostUtilityReturn<T> = [
	(options: PostUtilityOptions<T>) => void,
	UsePostUtilityState<T>
];

export default function usePostUtility<T = any>(
	url: string
): PostUtilityReturn<T> {
	const [state, setState] = useState<UsePostUtilityState<T>>({
		isLoading: false,
		data: undefined,
		error: undefined,
	});

	async function mutate(options: PostUtilityOptions<T>) {
		const { method = "post", body } = options;
		setState((prev) => ({ ...prev, isLoading: true }));
		try {
			const request = await axios.request({
				url: url,
				method: method,
				data: body,
				headers: options?.multipart
					? {
							"Content-Type": "multipart/form-data",
					  }
					: {
							"Content-Type": "application/json",
					  },
			});

			const requestData = await request.data;
			setState((prev) => ({ ...prev, data: requestData }));
		} catch (error) {
			setState((prev) => ({ ...prev, error: error as AxiosError }));
		} finally {
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	}

	return [mutate, state];
}
