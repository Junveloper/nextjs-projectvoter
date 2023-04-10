import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import fetcher from "@/uilities/client/fetcher";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{
				fetcher,
				onError: (error) => {
					console.log("SWRConfigError: ", error);
				},
			}}
		>
			<Component {...pageProps} />
		</SWRConfig>
	);
}
