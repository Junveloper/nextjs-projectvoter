import NavBar from "./Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div>
			<NavBar></NavBar>
			{children}
		</div>
	);
}
