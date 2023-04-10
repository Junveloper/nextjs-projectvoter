import useUser from "@/uilities/client/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function WithUnauth<T extends {}>(Component: React.ComponentType<T>) {
	return function WithAuthComponent(props: T) {
		const router = useRouter();
		const { user, isLoading } = useUser();
		useEffect(() => {
			if (!isLoading && user) {
				router.push("/");
			}
		}, [isLoading, user, router]);
		return user ? null : <Component {...props} />;
	};
}
