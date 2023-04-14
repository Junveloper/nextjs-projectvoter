import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import { classNames } from "@/uilities/generalUtils";
import useUser from "@/uilities/client/useUser";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
	const { user, mutate } = useUser();
	const router = useRouter();

	const logout = async () => {
		const logoutRequest = await axios.get("/api/auth/logout");
		if (logoutRequest.data.ok) {
			router.push("/");
			mutate();
		}
	};

	useEffect(() => {
		mutate();
	}, [user, mutate]);

	const useCheckPath = (path: string): boolean => {
		const router = useRouter();
		const currentPath = router.pathname;
		return currentPath === path;
	};

	const isHome = useCheckPath("/");
	const isLogin = useCheckPath("/login");
	const isRegister = useCheckPath("/register");

	const navigation = [
		{
			name: "Programs",
			href: "/programs",
			current: useCheckPath("/program"),
		},
		{
			name: "Participants",
			href: "/participants",
			current: useCheckPath("/participants"),
		},
		{
			name: "Vote Tickets",
			href: "/tickets",
			current: useCheckPath("/tickets"),
		},
		{
			name: "Results",
			href: "/results",
			current: useCheckPath("/results"),
		},
	];
	return (
		<Disclosure as="nav" className="bg-gray-800">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								{/* Mobile menu button*/}
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">
										Open main menu
									</span>
									{open ? (
										<XMarkIcon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									) : (
										<Bars3Icon
											className="block h-6 w-6"
											aria-hidden="true"
										/>
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link href={"/"}>
										<div
											className={classNames(
												"h-8 w-32 text-white font-bold sm:flex items-center justify-center hidden",
												isHome
													? "bg-gray-900 rounded-md px-3 py-2"
													: ""
											)}
										>
											Project Voter
										</div>
										<div
											className={classNames(
												"flex sm:hidden text-white p-3",
												isHome
													? "bg-gray-900 rounded-md"
													: ""
											)}
										>
											<FontAwesomeIcon icon={faHouse} />
										</div>
									</Link>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4 items-center justify-center text-center">
										{navigation.map((item) => (
											<a
												key={item.name}
												href={item.href}
												className={classNames(
													item.current
														? "bg-gray-900 text-white"
														: "text-gray-300 hover:bg-gray-700 hover:text-white",
													"rounded-md px-3 py-2 text-sm font-medium"
												)}
												aria-current={
													item.current
														? "page"
														: undefined
												}
											>
												{item.name}
											</a>
										))}
									</div>
								</div>
							</div>
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
								{/* Profile dropdown */}
								{user ? (
									<Menu as="div" className="relative ml-3">
										<div>
											<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
												<span className="sr-only">
													Open user menu
												</span>
												<div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
													{user?.name[0]}
												</div>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															Your Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															onClick={logout}
															className={classNames(
																active
																	? "bg-gray-100"
																	: "",
																"block px-4 py-2 text-sm text-gray-700"
															)}
														>
															Sign out
														</a>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								) : (
									<Menu as="div" className="flex">
										<Link href={"/login"}>
											<div
												className={classNames(
													isLogin
														? "bg-gray-900 text-white"
														: "text-gray-300 hover:bg-gray-700 hover:text-white",
													"rounded-md px-3 py-2 text-sm font-medium"
												)}
											>
												Login
											</div>
										</Link>
										<Link href={"/register"}>
											<div
												className={classNames(
													isRegister
														? "bg-gray-900 text-white"
														: "text-gray-300 hover:bg-gray-700 hover:text-white",
													"rounded-md px-3 py-2 text-sm font-medium"
												)}
											>
												Register
											</div>
										</Link>
									</Menu>
								)}
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						<div className="space-y-1 px-2 pb-3 pt-2">
							{navigation.map((item) => (
								<Disclosure.Button
									key={item.name}
									as="a"
									href={item.href}
									className={classNames(
										item.current
											? "bg-gray-900 text-white"
											: "text-gray-300 hover:bg-gray-700 hover:text-white",
										"block rounded-md px-3 py-2 text-base font-medium"
									)}
									aria-current={
										item.current ? "page" : undefined
									}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
