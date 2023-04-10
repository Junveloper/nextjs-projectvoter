import useSWR from "swr";

interface UserResponse {
	ok: boolean;
	user: {
		id: number;
		email: string;
		name: string;
		currentProgramId: string;
	};
}
export default function useUser() {
	const { data, error, mutate } = useSWR<UserResponse>("/api/auth");

	return { user: data?.user, isLoading: !data && !error, mutate };
}
