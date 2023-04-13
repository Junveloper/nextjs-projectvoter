import useTicket from "@/uilities/client/useTicket";
import { Participant, Program, VotingTicket, Vote } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";
import { cloudflareImageBaseURL } from "../config";
import axios from "axios";
import { classNames } from "@/uilities/generalUtils";

interface ParticipantsWithVotes extends Participant {
	_count: {
		votes: number;
	};
	voted: boolean;
}

interface ProgramWithParticipants extends Program {
	participants: ParticipantsWithVotes[];
}

interface votingTicketWithAttributes extends VotingTicket {
	program: ProgramWithParticipants;
}

interface votingTicketResponse {
	ok: boolean;
	votingTicket: votingTicketWithAttributes;
}

export default function PublicProgram() {
	const { votingTicket, isLoading, mutate } = useTicket();
	const {
		data,
		mutate: mutateProgram,
		isLoading: loadingProgram,
	} = useSWR<votingTicketResponse>("api/ticket/program");

	useEffect(() => {
		if (!isLoading && votingTicket) {
			mutate();
			mutateProgram();
		}
	}, [votingTicket, isLoading, mutate, mutateProgram]);

	useEffect(() => {
		if (!loadingProgram && data) {
			mutateProgram();
		}
	}, [data, mutateProgram, loadingProgram]);

	const castVote = async (id: number) => {
		const postRequest = await axios.post("/api/vote", {
			participantId: id,
		});
		if (postRequest.data.ok) {
			mutate();
			mutateProgram();
		}
	};

	const revokeVote = async (id: number) => {
		const patchRequest = await axios.patch("/api/vote", {
			participantId: id,
		});
		if (patchRequest.data.ok) {
			mutate();
			mutateProgram();
		}
	};

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
			) : (
				<>
					<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
						<div className="sm:mx-auto sm:w-full sm:max-w-4xl">
							<h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
								Welcome to{" "}
								{data?.votingTicket?.program?.programName}
							</h2>
						</div>
						<div className="sm:mx-auto sm:w-full sm:max-w-4xl mt-2 sm:px-0 px-2">
							<div className="sm:flex-auto">
								<h1 className="text-base font-semibold leading-6 text-gray-900">
									Participants
								</h1>
								<p className="mt-2 text-sm text-gray-700">
									The below is the list of participants you
									can cast vote to.
								</p>
							</div>
						</div>
						<div className="sm:mx-auto sm:w-full sm:max-w-4xl mt-2 sm:px-0 px-2">
							<div className="sm:flex-auto">
								{votingTicket?.remainingVotes > 0 ? (
									<h1 className="text-base font-semibold leading-6 text-green-900">
										Remaining Votes:{" "}
										{votingTicket?.remainingVotes}
									</h1>
								) : (
									<h1 className="text-base font-semibold leading-6 text-red-900">
										You have no remaining votes.
									</h1>
								)}
							</div>
						</div>
						<div className="mt-8 flow-root sm:px-0 px-2">
							<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
								<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
									<div className="sm:px-0 sm:overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
										<table className="divide-y divide-gray-300 w-full mx-auto">
											<thead className="bg-gray-50">
												<tr>
													<th
														scope="col"
														className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
													>
														Participant
													</th>
													<th
														scope="col"
														className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Summary
													</th>

													<th
														scope="col"
														className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Actions
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200 bg-white">
												{data?.votingTicket?.program?.participants?.map(
													(participant) => (
														<tr
															key={participant.id}
														>
															<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
																{
																	participant.name
																}
															</td>
															<td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
																<div className="sm:w-36 sm:h-36 w-full aspect-square relative float-left mr-5">
																	<Image
																		src={`${cloudflareImageBaseURL}/${participant.image}/avatar`}
																		className="object-scale-down"
																		fill
																		alt={`${participant.name} Image`}
																	></Image>
																</div>
																<div>
																	{
																		participant.summary
																	}
																</div>
															</td>
															<td className="whitespace-nowrap py-4 text-sm font-medium text-gray-900">
																<div className="flex justify-center flex-col items-center">
																	{participant.voted && (
																		<span>
																			Voted
																		</span>
																	)}
																	{!participant.voted ? (
																		<button
																			className={classNames(
																				"rounded  px-2 text-xs font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  h-9 sm:ml-1",
																				votingTicket?.remainingVotes >
																					0
																					? "bg-green-600 focus-visible:outline-green-600 hover:bg-green-500 "
																					: "cursor-not-allowed bg-slate-600 focus-visible:outline-slate-600 hover:bg-slate-500"
																			)}
																			onClick={() =>
																				castVote(
																					participant.id
																				)
																			}
																			disabled={
																				votingTicket?.remainingVotes <=
																				0
																			}
																		>
																			{votingTicket?.remainingVotes <=
																			0
																				? "No Votes Left"
																				: "Vote"}
																		</button>
																	) : (
																		<button
																			className="rounded bg-red-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 h-9 sm:ml-1"
																			onClick={() =>
																				revokeVote(
																					participant.id
																				)
																			}
																		>
																			Revoke
																		</button>
																	)}
																</div>
															</td>
														</tr>
													)
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
