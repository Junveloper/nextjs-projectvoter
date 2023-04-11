import useSWR from "swr";

interface TicketResponse {
	ok: boolean;
	votingTicket: {
		id: number;
		voteKey: string;
		programId: number;
		remainingVotes: number;
	};
}

export default function useTicket() {
	const { data, error, mutate } = useSWR<TicketResponse>("/api/ticket");

	return {
		votingTicket: data?.votingTicket,
		isLoading: !data && !error,
		mutate,
	};
}
