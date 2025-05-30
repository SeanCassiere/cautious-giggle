import React from "react";
import "./style.css";
import { Link, Route, useLocation } from "wouter";

const HomePage = React.lazy(() => import("./pages/home"));
const ExpensiveSum = React.lazy(() => import("./pages/expensive-sum"));

function withSuspense(Component: React.ComponentType) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function SuspendedComponent(props: any) {
		const [location] = useLocation();

		return (
			<React.Suspense fallback={<div>Loading for {location}...</div>}>
				<Component {...props} />
			</React.Suspense>
		);
	};
}

export default function App() {
	return (
		<RootDocument>
			<nav>
				<ul>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/expensive-sum'>Expensive Sum</Link>
					</li>
				</ul>
			</nav>

			<Route path='/expensive-sum' component={withSuspense(ExpensiveSum)} />
			<Route path='/' component={withSuspense(HomePage)} />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<React.StrictMode>
			<html lang='en'>
				<head>
					<title>Framework App</title>
				</head>
				<body>{children}</body>
			</html>
		</React.StrictMode>
	);
}
