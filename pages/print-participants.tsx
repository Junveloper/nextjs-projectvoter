import Layout from "@/components/Layout";
import { ProgramsResponse } from "./programs";
import useSWR from "swr";
import { useEffect } from "react";
import Image from "next/image";
import { cloudflareImageBaseURL } from "./config";

export default function PrintParticipants() {
	const { data, error, mutate } = useSWR<ProgramsResponse>("api/programs");

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<>
			{data?.ok && data.currentProgram ? (
				data?.currentProgram?.participants.map((participant) => {
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
							<div className="flex flex-col h-full justify-evenly">
								<div className="font-black text-5xl">
									{participant.name}
								</div>
								<div className="mx-auto">
									{participant.image ? (
										<div className="h-72 w-72 relative mx-auto">
											<Image
												alt={participant.name}
												src={`${cloudflareImageBaseURL}/${participant.image}/public`}
												fill
											></Image>
										</div>
									) : (
										<div>no image</div>
									)}
								</div>
								<p className="mt-3">{participant.summary}</p>
								<div className="card">
									<div className="card-body">
										To vote for our group
										<br /> please scan the QR Code below!
										<div className="text-center mt-3">
											QR Code
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div>Loading</div>
			)}
		</>
	);
}

// @foreach ($projects as $project)
//         <div class="page text-center p-4">
//             <div class="d-flex flex-column h-100 justify-content-evenly">
//                 <h1 style="font-weight:800;font-size:46px">{{ $project->name }}</h1>
//                 <div class="col-4 mx-auto">
//                     @if ($project->image)
//                         <img src="/{{ $project->image }}" class="img-fluid" style="max-height: 250px">
//                     @else
//                         <img class="img-fluid" src="/img/no_image.jpeg">
//                     @endif
//                 </div>
//                 <p class="mt-3" style="font-size: 20px;">
//                     {{ $project->summary }}
//                 </p>
//                 <div class="card">
//                     <div class="card-body" style="font-size:16px">
//                         To vote for our group<br /> please scan the QR Code below!
//                         <div class="text-center mt-3">
//                             {!! QrCode::size(200)->generate(url('/project' . '/' . $project->id)) !!}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     @endforeach
