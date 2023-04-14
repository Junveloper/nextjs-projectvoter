import Layout from "@/components/Layout";
import { ProgramWithAttributes, ProgramsResponse } from "../..";
import useSWR from "swr";
import Image from "next/image";
import { cloudflareImageBaseURL } from "../../../../uilities/config";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/router";
import { WithAuth } from "@/components/WithAuth";

interface ProgramWithParticipantsResponse {
	ok: boolean;
	program: ProgramWithAttributes;
}

function PrintParticipants() {
	const router = useRouter();
	const { id } = router.query;

	const { data } = useSWR<ProgramWithParticipantsResponse>(
		`api/programs/${id}/participants`
	);

	return (
		<>
			{data?.ok && data.program ? (
				data?.program?.participants?.length &&
				data?.program?.participants?.length > 0 ? (
					data.program.participants.map((participant) => {
						return (
							<div
								key={participant.id}
								className="text-center p-4"
								style={{
									width: "21cm",
									height: "29.7cm",
									border: "2px solid black",
									marginBottom: "2cm",
								}}
							>
								<div className="flex flex-col h-full justify-between">
									<div className="font-black text-5xl">
										{participant.name}
									</div>
									<div className="mx-auto">
										{participant.image ? (
											<div className="h-72 w-72 relative mx-auto">
												<Image
													alt={participant.name}
													src={`${cloudflareImageBaseURL}/${participant.image}/public`}
													className="object-scale-down"
													fill
												></Image>
											</div>
										) : (
											<div>no image</div>
										)}
									</div>
									<p>{participant.summary}</p>
									<div className="bg-slate-300 border rounded-lg py-8 relative bottom-7 flex flex-col">
										<div className="font-semibold mb-3">
											To vote for our group
											<br /> please scan the QR Code
											below!
										</div>
										<div className="flex justify-center">
											<QRCodeSVG
												value={`${process.env.NEXT_PUBLIC_BASE_URL}/participants/${participant.id}`}
												width={200}
												height={200}
											></QRCodeSVG>
										</div>
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="text-center mt-8 h-screen flex items-center justify-center text-2xl">
						There are no registered participants for this program (
						{data.program.programName}).
					</div>
				)
			) : (
				<div>Loading...</div>
			)}
		</>
	);
}

export default WithAuth(PrintParticipants);
