import Layout from "@/components/Layout";
import { ProgramWithAttributes, ProgramsResponse } from "../..";
import useSWR from "swr";
import Image from "next/image";
import { cloudflareImageBaseURL } from "../../../../uilities/config";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/router";
import { chunk } from "@/uilities/generalUtils";
import { WithAuth } from "@/components/WithAuth";

interface ProgramWithParticipantsResponse {
	ok: boolean;
	program: ProgramWithAttributes;
}

function PrintTickets() {
	const router = useRouter();
	const { id } = router.query;

	const { data } = useSWR<ProgramWithParticipantsResponse>(
		`api/programs/${id}/tickets`
	);
	return (
		<>
			{data?.ok && data.program ? (
				data?.program?.votingTickets &&
				data?.program?.votingTickets?.length > 0 ? (
					chunk(data.program.votingTickets, 8).map(
						(eightTickets, index) => {
							return (
								<div
									key={index}
									className="text-center p-4"
									style={{
										width: "21cm",
										height: "29.7cm",
										display: "grid",
										gridTemplateColumns: "repeat(2, 1fr)",
										gridTemplateRows: "repeat(4, 1fr)",
										marginBottom: "2cm",
									}}
								>
									{eightTickets.map((ticket) => {
										return (
											<div
												className="text-center box-border border"
												key={ticket.id}
											>
												<div className="font-bold">
													Voting Ticket
												</div>
												<div className="text-sm mb-1">
													Scan the QR code to gain
													voting privilage.
												</div>
												<div className="flex justify-center">
													<QRCodeSVG
														value={`${process.env.NEXT_PUBLIC_BASE_URL}/public/bind-ticket/${ticket.voteKey}`}
														width={185}
														height={185}
													/>
												</div>
												<div>
													<span className="text-sm">
														Voting key:{" "}
													</span>
													<br />
													<span className="font-semibold">
														{ticket.voteKey}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							);
						}
					)
				) : (
					<div className="text-center mt-8 h-screen flex items-center justify-center text-2xl">
						There are currently no created voting tickets for this
						program. ({data.program.programName}).
					</div>
				)
			) : (
				<div>Loading...</div>
			)}
		</>
	);
}

export default WithAuth(PrintTickets);
