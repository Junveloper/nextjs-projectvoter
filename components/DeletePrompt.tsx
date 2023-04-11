import axios from "axios";
import { useState } from "react";

interface DeletePromptProps {
	message: string;
	url: string;
	onHide: () => void;
	refetch: () => void;
	isPatch?: boolean;
}

interface Response {
	ok: boolean;
	redirect_url?: string;
}

export default function DeletePrompt({
	message,
	url,
	onHide,
	refetch,
	isPatch = false,
}: DeletePromptProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const sendRequest = async () => {
		try {
			setIsDeleting(true);
			const response: Response = await axios.request({
				method: "DELETE",
				url,
			});
			refetch();
			return onHide();
		} catch (error) {
			console.log(error);
		} finally {
			setIsDeleting(false);
		}
	};
	return (
		<>
			<div className="absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center">
				<div className="bg-slate-100 w-3/4 max-w-lg border rounded-md p-5">
					<div className="text-center pt-4">{message}</div>
					<div className="flex justify-center py-5 gap-2">
						{isDeleting ? (
							<div className="rounded-lg bg-slate-400 p-2 text-white text-sm font-bold">
								Please Wait
							</div>
						) : (
							<>
								<button
									className="rounded bg-red-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 h-9 sm:ml-1"
									onClick={onHide}
								>
									Abort
								</button>
								<button
									className="rounded bg-green-600 px-2 text-xs font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 h-9 sm:ml-1"
									onClick={sendRequest}
								>
									Confirm
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
