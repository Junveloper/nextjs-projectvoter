import Layout from "@/components/Layout";
import { WithUnauth } from "@/components/WithUnauth";
import usePostUtility from "@/uilities/client/usePostUtility";
import { classNames } from "@/uilities/generalUtils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterFormData {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
}

function Register() {
	const [registerUser, { data, isLoading, error }] =
		usePostUtility("/api/auth/register");

	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
		watch,
	} = useForm<RegisterFormData>();

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onValid = (data: RegisterFormData) => {
		if (isLoading) {
			return;
		}
		clearErrors();
		setErrorMessage(null);
		registerUser({ body: data });
	};

	useEffect(() => {
		if (error) {
			const errorMessage = (error?.response?.data as { error: string })
				?.error;
			setErrorMessage(errorMessage);
		}
	}, [error]);

	return (
		<Layout>
			<>
				<div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
							Create an account
						</h2>
						<p className="mt-2 text-center text-sm text-gray-600">
							and create the ultimate voter experience for your
							events.
						</p>
					</div>

					<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
						<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
							<form
								className="space-y-6"
								onSubmit={handleSubmit(onValid)}
							>
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Name
									</label>
									<div className="mt-2">
										<input
											{...register("name", {
												required: true,
											})}
											type="text"
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Email address
									</label>
									<div className="mt-2">
										<input
											{...register("email", {
												required: true,
											})}
											type="email"
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Password
									</label>
									<div className="mt-2">
										<input
											{...register("password", {
												required: true,
											})}
											type="password"
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
								<div>
									<label
										htmlFor="confirmPassword"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Confirm Password
									</label>
									<div className="mt-2">
										<input
											{...register("confirmPassword", {
												required: true,
												validate: (value) =>
													value ===
														watch("password") ||
													"Passwords must match",
											})}
											type="password"
											className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
										{errors["confirmPassword"]?.message && (
											<p className="text-sm text-red-600">
												{
													errors["confirmPassword"]
														?.message
												}
											</p>
										)}
									</div>
								</div>

								<div>
									<button
										type="submit"
										className={classNames(
											"flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
											isLoading
												? "bg-slate-600 hover:bg-slate-500 focus-visible:outline-slate-600"
												: ""
										)}
										disabled={isLoading}
									>
										{isLoading
											? "Please Wait..."
											: "Register"}
									</button>
								</div>
								{errorMessage && (
									<span className="text-sm text-red-500">
										{errorMessage}
									</span>
								)}
							</form>
						</div>
					</div>
				</div>
			</>
		</Layout>
	);
}

export default WithUnauth(Register);
