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
		data,
		error: getError,
		mutate,
	} = useSWR<ProgramsResponse>("api/programs", { refreshInterval: 10000 });

	const [graphData, setGraphData] = useState<graphData>();
	const [graphOptions, setGraphOptions] = useState({
		scales: {
			y: {
				min: 0,
				max: 10,
			},
		},
	});
	useEffect(() => {
		if (data?.currentProgram?.participants) {
			const sortedParticipants = [
				...data.currentProgram.participants,
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
	}, [data]);

	return (
		<Layout>
			<>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
							Results Page
						</h2>
					</div>

					<div className="px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								{graphData && (
									<div className="max-w-4xl mx-auto">
										<Bar
											data={graphData}
											options={graphOptions}
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
												{data?.currentProgram?.participants?.map(
													(participant) => (
														<tr
															key={participant.id}
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
				</div>
			</>
		</Layout>
	);
}

export default WithAuth(Results);
