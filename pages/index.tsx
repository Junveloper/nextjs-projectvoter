import Layout from "@/components/Layout";
import {
	faAward,
	faFile,
	faPersonCirclePlus,
	faTicket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Home() {
	return (
		<Layout>
			<div className="mx-auto max-w-6xl mt-5 sm:px-2 px-4">
				<div className="mx-auto sm:text-lg text-center px-2 my-5">
					Project Voter has been created to provide an interactive way
					of digital voting for your school projects such as speech
					competition or any other project that requires voting. You
					can simply follow the steps below to get started!
				</div>
				<ul role="list" className="divide-y divide-gray-200">
					<li className="py-4 sm:flex gap-x-3">
						<div className="text-center ">
							<FontAwesomeIcon
								icon={faFile}
								className="h-32 w-32 bg-slate-200 p-2 rounded-xl"
							/>
						</div>
						<div>
							<p className="font-bold my-3">
								Step 1. Register a program
							</p>
							<p>
								Add a program on the Programs tab. Simply write
								down the name of the program you are running
								(i.e. Persuasive Speech Competition) and decide
								on how many votes people can cast.
							</p>
						</div>
					</li>
					<li className="py-4 sm:flex gap-x-3">
						<div className="text-center ">
							<FontAwesomeIcon
								icon={faPersonCirclePlus}
								className="h-32 w-32 bg-slate-200 p-2 rounded-xl"
							/>
						</div>
						<div>
							<p className="font-bold my-3">
								Step 2. Add participants to the program
							</p>
							<p>
								Add participants that will be competing in the
								program. Minimal information is required, just
								the chosen name of the participant and a short
								summary. You can add an image if you want! You
								will be able to create a printable A4 sheet for
								the display if you wish.
							</p>
						</div>
					</li>
					<li className="py-4 sm:flex gap-x-3">
						<div className="text-center my-3">
							<FontAwesomeIcon
								icon={faTicket}
								className="h-32 w-32 bg-slate-200 p-2 rounded-xl"
							/>
						</div>
						<div>
							<p className="font-bold">
								Step 3. Create voting tickets
							</p>
							<p>
								Create voting tickets and hand one out to the
								audience of the program. Each ticket will grant
								an audience rights to vote. If people can cast
								multiple votes, they can&apos;t cast the vote on
								the same participant. If the audience changes
								their mind, they can revoke their vote and
								regain their voting count!
							</p>
						</div>
					</li>
					<li className="py-4 sm:flex gap-x-3">
						<div className="text-center ">
							<FontAwesomeIcon
								icon={faAward}
								className="h-32 w-32 bg-slate-200 p-2 rounded-xl"
							/>
						</div>
						<div>
							<p className="font-bold my-3">
								Step 4. Announce the winner!
							</p>
							<p>
								No need for the manual counting! Results page
								will update every 5 seconds. If you want some
								excitement, you can display the result page to
								the audience so they can see the results live!
							</p>
						</div>
					</li>
				</ul>
			</div>
		</Layout>
	);
}
