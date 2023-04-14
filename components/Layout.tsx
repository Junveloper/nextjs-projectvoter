import Head from "next/head";
import NavBar from "./Navbar";
interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div>
			<Head>
				<title>Project Voter</title>
			</Head>
			<NavBar></NavBar>
			{children}
		</div>
	);
}
