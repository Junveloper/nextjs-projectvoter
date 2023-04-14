import useTicket from "@/uilities/client/useTicket";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import QrScanner from "qr-scanner";
import { useForm } from "react-hook-form";
import usePostUtility from "@/uilities/client/usePostUtility";
import { VotingTicket } from "@prisma/client";

interface TicketRegisterFormData {
	voteKey: string;
}

interface voteKeySubmitResponse {
	ok: boolean;
	ticket: VotingTicket;
}

export default function RegisterTicket() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [videoReady, setVideoReady] = useState(false);

	useEffect(() => {
		if (open) {
			setVideoReady(true);
		} else {
			setVideoReady(false);
		}
	}, [open]);

	const { register, handleSubmit, setValue } =
		useForm<TicketRegisterFormData>();
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);
	const submitButtonRef = useRef<HTMLButtonElement>(null);
	const toggleCamera = () => {
		setOpen(true);
	};

	const onValid = (data: TicketRegisterFormData) => {
		if (ticketLoading) {
			return;
		}
		postTicket({ body: data });
	};

	useEffect(() => {
		if (videoReady && videoRef.current) {
			qrScannerRef.current = new QrScanner(
				videoRef.current,
				(result: string) => {
					const voteKey = result.split("/").pop();
					if (voteKey) {
						setValue("voteKey", voteKey);
					}
					qrScannerRef?.current?.stop();
					setOpen(false);
					submitButtonRef.current?.click();
				}
			);
			qrScannerRef.current.start();
		}
		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.stop();
			}
		};
	}, [videoReady, open, setOpen, router, setValue, handleSubmit]);

	const { votingTicket, isLoading, mutate } = useTicket();

	const [postTicket, { data, isLoading: ticketLoading, error }] =
		usePostUtility<voteKeySubmitResponse>("/api/ticket");

	useEffect(() => {
		if (!isLoading && votingTicket?.id) {
			mutate();
			router.push("/public/program");
		}
	}, [votingTicket, isLoading, router, mutate]);

	useEffect(() => {
		if (!ticketLoading && data?.ok) {
			mutate();
			router.push("/public/program");
		}
	}, [data, ticketLoading, router, mutate]);

	return (
		<>
			<div className="flex h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 items-center px-3">
				<div>
					Please either scan the QR code or enter the voting key
					manually.
				</div>
				<button
					className="rounded bg-green-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-9 sm:ml-1 flex items-center justify-center w-32 py-5 my-3"
					onClick={toggleCamera}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						className="w-12 h-12 py-2"
					>
						<path
							d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
							fill="white"
						/>
					</svg>
					<div>Scan QR</div>
				</button>
				<form
					className="flex flex-col justify-center"
					onSubmit={handleSubmit(onValid)}
				>
					<span className="text-center font-bold">
						Enter Your Voting Ticket Key Below or Scan
					</span>
					<span className="text-sm text-center">
						6 characters including a dash(-)
					</span>
					<input
						{...register("voteKey")}
						id="vote-key"
						type="text"
						min={0}
						placeholder="Enter the key here"
						className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2"
					></input>
					<button
						className="rounded bg-blue-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 h-9 sm:ml-1"
						ref={submitButtonRef}
					>
						Submit
					</button>
				</form>
			</div>
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
							<div className="flex min-h-screen items-center justify-center p-4 text-center">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
									enterTo="opacity-100 translate-y-0 sm:scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 translate-y-0 sm:scale-100"
									leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								>
									<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-sm sm:mx-auto sm:p-6">
										<div>
											<video
												ref={videoRef}
												className="w-96 h-96 border bg-slate-500 mx-auto"
											></video>
											<div className="mt-3 text-center sm:mt-5">
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														Please focus on your QR
														Code on your voting
														ticket. This window will
														automatically disappear
														on the successful scan.
													</p>
												</div>
											</div>
										</div>
										<div className="mt-5 sm:mt-6">
											<button
												type="button"
												className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
												onClick={() => setOpen(false)}
											>
												Close
											</button>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition.Root>
			)}
		</>
	);
}
