import Layout from "@/components/Layout";
import { WithAuth } from "@/components/WithAuth";
import usePostUtility from "@/uilities/client/usePostUtility";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Link from "next/link";
import { ProgramsResponse } from "./programs";
import { SwitchProgramFormData } from "./participants";
import { useEffect, useState } from "react";

interface VoteCreationFormData {
	quantity: number;
	programId: number;
}

function Tickets() {
	const {
		data: programsData,
		mutate: mutatePrograms,
		isLoading: programsLoading,
	} = useSWR<ProgramsResponse>("api/programs");

	const [switchProgram, { data, isLoading, error }] =
		usePostUtility("/api/user");
	const { register, handleSubmit, setValue } =
		useForm<SwitchProgramFormData>();

	const onValid = (formData: SwitchProgramFormData) => {
		if (isLoading) {
			return;
		}
		switchProgram({ body: formData, method: "PATCH" });
	};

	useEffect(() => {
		if (data?.ok && !isLoading) {
			mutatePrograms();
		}
	}, [data, isLoading, mutatePrograms]);

	const [
		registerTickets,
		{ data: ticketsData, isLoading: ticketsLoading, error: ticketsError },
	] = usePostUtility("/api/tickets");

	const {
		register: registerTicketsForm,
		handleSubmit: handleRegisterTickets,
	} = useForm<VoteCreationFormData>();

	const onValidTicketsForm = (formData: VoteCreationFormData) => {
		if (ticketsLoading) {
			return;
		}
		setMessage("");
		registerTickets({ body: formData });
	};

	const [message, setMessage] = useState("");

	useEffect(() => {
		if (ticketsData?.ok && !ticketsLoading) {
			setMessage("Tickets registered successfully!");
		}
		mutatePrograms();
	}, [ticketsData, mutatePrograms, ticketsLoading]);

	return (
		<Layout>
			{programsLoading ? (
				<div>Loading...</div>
			) : (
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
							Voting Ticket Page
						</h2>
					</div>
					{programsData?.programs &&
					programsData?.programs.length > 0 ? (
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
											{...register("programId")}
											defaultValue={
												programsData?.currentProgram?.id
											}
											id="program"
											className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-9"
										>
											{programsData?.programs?.map(
												(program) => {
													return (
														<option
															key={program.id}
															value={program.id}
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
					) : (
						<div className="my-3 text-center">
							You must add a program first to create voting
							tickets for the audience.{" "}
							<Link
								href={"/programs"}
								className="text-blue-500 underline"
							>
								Click here
							</Link>{" "}
							to add a program
						</div>
					)}

					{programsData?.currentProgram && (
						<>
							<div className="sm:flex sm:items-center border-b py-3 mb-3">
								<div className="sm:flex-auto">
									<h1 className="text-base font-semibold leading-6 text-gray-900">
										Tickets
									</h1>
									<p className="mt-2 text-sm text-gray-700">
										This is where you can create unique
										voting tickets for the attendees to the
										program. Each patron should be given one
										ticket and they simply scan the QR code
										to get the voting previlage. This is to
										limit the voting power to the actual
										attendees.
									</p>
								</div>
							</div>
							<div className="sm:flex sm:items-center items-center justify-center">
								<form
									onSubmit={handleRegisterTickets(
										onValidTicketsForm
									)}
								>
									<label
										htmlFor="ticket-quantity"
										className="flex items-center justify-center"
									>
										<span className="w-full">
											Create Extra Tickets
										</span>
										<input
											{...registerTicketsForm("quantity")}
											id="ticket-quantity"
											type="number"
											min={0}
											placeholder="Ticket Quantity"
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										></input>
										{programsData?.currentProgram?.id && (
											<input
												{...registerTicketsForm(
													"programId"
												)}
												defaultValue={
													programsData.currentProgram
														.id
												}
												className="hidden"
											></input>
										)}

										<button className="rounded bg-blue-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 h-9 sm:ml-1">
											Create
										</button>
									</label>
								</form>
							</div>
							{ticketsLoading ? (
								<div className="sm:flex sm:items-center items-center justify-center text-gray-600 text-sm font-medium mt-3">
									Creating tickets, please wait..
								</div>
							) : (
								<div className="sm:flex sm:items-center items-center justify-center text-green-600 text-sm font-medium mt-3">
									{message}
								</div>
							)}

							<div className="flex flex-col items-center bg-slate-200 p-3 max-w-xl mx-auto rounded-lg my-3">
								<div className="mx-auto my-2 text-sm">
									This program currently has{" "}
									<span className="font-bold">
										{
											programsData?.currentProgram?._count
												?.votingTickets
										}
									</span>{" "}
									tickets.
								</div>
								<Link
									href={`/programs/${programsData?.currentProgram?.id}/tickets`}
									target="_blank"
									rel="noopener"
								>
									<button
										className="rounded bg-slate-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 h-9 sm:ml-1"
										type="button"
									>
										Print/View Tickets
									</button>
								</Link>
								<div className="my-2">
									Please check print preview before printing.
								</div>
							</div>
						</>
					)}
				</div>
			)}
		</Layout>
	);
}

export default WithAuth(Tickets);
