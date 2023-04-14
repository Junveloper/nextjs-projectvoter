import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html className="h-full bg-gray-50">
			<Head title="Project Voter" />
			<body className="h-full">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
