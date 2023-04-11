import useTicket from "@/uilities/client/useTicket";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PublicProgram() {
	const router = useRouter();
	const { id } = router.query;
	const { votingTicket, isLoading, mutate } = useTicket();

	return (
		<>
			{!votingTicket ? (
				<>
					<div className="flex h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
						<div className="p-5 bg-slate-200 h-1/2 flex flex-col items-center justify-center">
							<div className="text-center">
								You have not registered your voting ticket to
								view this program. Click the button below to
								visit ticket registration page.
							</div>
							<Link href={"/public/bind-ticket"} className="my-5">
								<button className="rounded bg-green-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-9 sm:ml-1">
									Ticket Registration Page
								</button>
							</Link>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}
