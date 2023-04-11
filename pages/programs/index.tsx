import Layout from "@/components/Layout";
import { WithAuth } from "@/components/WithAuth";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import usePostUtility from "@/uilities/client/usePostUtility";
import { classNames } from "@/uilities/generalUtils";
import { useForm } from "react-hook-form";
import { Participant, Program, VotingTicket } from "@prisma/client";
import useSWR from "swr";

interface ProgramFormData {
	name: string;
	defaultVoteCount: number;
}

export interface ProgramWithAttributes extends Program {
	participants?: Participant[];
	votingTickets?: VotingTicket[];
	_count: {
		votingTickets: number;
	};
}

export interface ProgramsResponse {
	ok: boolean;
	programs: ProgramWithAttributes[];
	currentProgram: ProgramWithAttributes;
}

function Programs() {
	const [open, setOpen] = useState(false);
	const [postProgram, { data: postData, isLoading, error: postError }] =
		usePostUtility("/api/programs");
	const { register, handleSubmit, reset } = useForm<ProgramFormData>();
	const {
		data,
		error: getError,
		mutate,
	} = useSWR<ProgramsResponse>("api/programs");
	const onValid = (formData: ProgramFormData) => {
		if (isLoading) {
			return;
		}
		postProgram({ body: formData });
	};

	useEffect(() => {
		if (postData?.ok && !isLoading) {
			reset();
			mutate();
			setOpen(false);
		}
	}, [postData, isLoading, mutate, reset]);

	return (
		<Layout>
			<>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
							Programs Page
						</h2>
					</div>
					<div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-3"
							onClick={() => setOpen(true)}
						>
							Add a program
						</button>
					</div>
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								<h1 className="text-base font-semibold leading-6 text-gray-900">
									Programs
								</h1>
								<p className="mt-2 text-sm text-gray-700">
									A list of all programs you registered to
									manage voting process.
								</p>
							</div>
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
														Name
													</th>
													<th
														scope="col"
														className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
													>
														Default Votes
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200 bg-white">
												{data?.programs?.map(
													(program) => (
														<tr key={program.id}>
															<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
																{
																	program.programName
																}
															</td>
															<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
																{
																	program.defaultVoteCount
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
			{open && (
				<Transition.Root show={open} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-10"
						onClose={setOpen}
					>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
						</Transition.Child>

						<div className="fixed inset-0 z-10 overflow-y-auto">
							<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
									enterTo="opacity-100 translate-y-0 sm:scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 translate-y-0 sm:scale-100"
									leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								>
									<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
										<div>
											<div className="mt-3 text-center sm:mt-5">
												<Dialog.Title
													as="h3"
													className="text-base font-semibold leading-6 text-gray-900"
												>
													Register a program
												</Dialog.Title>
												<div className="mt-2">
													<form
														onSubmit={handleSubmit(
															onValid
														)}
													>
														<div>
															<label
																htmlFor="name"
																className="block text-sm font-medium leading-6 text-gray-900"
															>
																Program Name
															</label>
															<div className="mt-2">
																<input
																	{...register(
																		"name",
																		{
																			required:
																				true,
																		}
																	)}
																	className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																	placeholder="Write the program name (i.e. 2023 Speech Comp)"
																/>
															</div>
														</div>

														<div>
															<label
																htmlFor="defaultVoteCount"
																className="block text-sm font-medium leading-6 text-gray-900"
															>
																Default Vote
																Count
															</label>
															<div className="mt-2">
																<input
																	{...register(
																		"defaultVoteCount",
																		{
																			required:
																				true,
																		}
																	)}
																	type="number"
																	min={1}
																	className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																	placeholder="Choose how many votes each person can give"
																/>
															</div>
														</div>
														<div className="mt-5 sm:mt-6">
															<button
																type="submit"
																className={classNames(
																	"inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
																	isLoading
																		? "bg-slate-600 hover:bg-slate-500 focus-visible:outline-slate-600"
																		: ""
																)}
																disabled={
																	isLoading
																}
															>
																{isLoading
																	? "Please Wait"
																	: "Register"}
															</button>
														</div>
													</form>
												</div>
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			)}
		</Layout>
	);
}

export default WithAuth(Programs);
