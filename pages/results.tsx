import Layout from "@/components/Layout";
import { WithAuth } from "@/components/WithAuth";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { ProgramsResponse } from "./programs";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Link from "next/link";
import usePostUtility from "@/uilities/client/usePostUtility";
import { SwitchProgramFormData } from "./participants";
import { useForm } from "react-hook-form";

interface barData {
	label?: string;
	data: number[];
	backgroundColor?: string;
}

interface graphData {
	labels: string[];
	datasets: barData[];
}

function Results() {
	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	);

	const {
		data: programsData,
		isLoading: programsLoading,
		error: getError,
		mutate: mutatePrograms,
	} = useSWR<ProgramsResponse>("api/programs", { refreshInterval: 10000 });

	const [switchProgram, { data, isLoading, error }] =
		usePostUtility("/api/user");

	const [graphData, setGraphData] = useState<graphData>();
	const [graphOptions, setGraphOptions] = useState({
		scales: {
			y: {
				min: 0,
				max: 10,
			},
		},
	});

	const onValid = (formData: SwitchProgramFormData) => {
		if (isLoading) {
			return;
		}
		switchProgram({ body: formData, method: "PATCH" });
	};

	const { register, handleSubmit, setValue } =
		useForm<SwitchProgramFormData>();

	useEffect(() => {
		if (programsData?.currentProgram?.participants) {
			const sortedParticipants = [
				...programsData.currentProgram.participants,
			].sort((a, b) => b._count.votes - a._count.votes);

			const labels = sortedParticipants.map(
				(participant) => participant.name
			);
			const graphDataPoints = sortedParticipants.map(
				(participant) => participant._count.votes
			);

			setGraphOptions({
				scales: {
					y: {
						min: 0,
						max: Math.max(...graphDataPoints),
					},
				},
			});

			setGraphData({
				labels,
				datasets: [
					{
						label: "Votes",
						data: graphDataPoints,
						backgroundColor: "rgba(255, 99, 132, 0.2)",
					},
				],
			});
		}
	}, [programsData]);

	return (
		<Layout>
			<>
				{programsLoading ? (
					<div>Loading...</div>
				) : (
					<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
						<div className="sm:mx-auto sm:w-full sm:max-w-md">
							<h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
								Results Page
							</h2>
						</div>
						{programsData?.programs &&
							programsData?.programs?.length > 0 && (
								<>
									<div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center mt-3">
										<form onSubmit={handleSubmit(onValid)}>
											<label
												htmlFor="program"
												className="block text-sm font-medium leading-6 text-gray-900 text-center"
											>
												Currently Selected Program:
											</label>
											<div className="flex items-center mt-3">
												{programsData ? (
													<select
														{...register(
															"programId"
														)}
														defaultValue={
															programsData
																?.currentProgram
																?.id
														}
														id="program"
														className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-9"
													>
														{programsData?.programs?.map(
															(program) => {
																return (
																	<option
																		key={
																			program.id
																		}
																		value={
																			program.id
																		}
																	>
																		{
																			program.programName
																		}
																	</option>
																);
															}
														)}
													</select>
												) : (
													<div>loading...</div>
												)}

												<button
													className="rounded bg-green-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-9 sm:ml-1"
													type="submit"
												>
													View
												</button>
											</div>
										</form>
									</div>
								</>
							)}

						{programsData?.currentProgram ? (
							<div className="px-4 sm:px-6 lg:px-8">
								{programsData?.currentProgram?.participants
									?.length !== 0 && (
									<div>
										<div className="sm:flex sm:items-center">
											<div className="sm:flex-auto">
												{graphData && (
													<div className="max-w-4xl mx-auto">
														<Bar
															data={graphData}
															options={
																graphOptions
															}
														></Bar>
													</div>
												)}
											</div>
										</div>
										<div className="text-center">
											The Current Winner: <br />
											<span className="font-bold">
												{graphData?.labels[0]}
											</span>
										</div>
									</div>
								)}

								<div className="mt-8 flow-root">
									<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
										<div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
											<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
												<table className="min-w-full divide-y divide-gray-300">
													<thead className="bg-gray-50">
														<tr>
															<th
																scope="col"
																className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
															>
																Participants
															</th>
															<th
																scope="col"
																className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
															>
																Votes
															</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-gray-200 bg-white">
														{programsData
															?.currentProgram
															?.participants
															?.length === 0 && (
															<tr>
																<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
																	No
																	participants
																	are added
																	for this
																	program yet.
																</td>
															</tr>
														)}
														{programsData?.currentProgram?.participants?.map(
															(participant) => (
																<tr
																	key={
																		participant.id
																	}
																>
																	<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
																		{
																			participant.name
																		}
																	</td>
																	<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																		{
																			participant
																				._count
																				.votes
																		}
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
						) : (
							<div className="my-3 text-center">
								You do not have any programs running.{" "}
								<Link
									href={"/programs"}
									className="text-blue-500 underline"
								>
									Click here
								</Link>{" "}
								to add a program
							</div>
						)}
					</div>
				)}
			</>
		</Layout>
	);
}

export default WithAuth(Results);
