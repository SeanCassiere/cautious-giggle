import React from "react";
import styles from "./style.css?url";
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
		<html lang='en'>
			<head>
				<title>Framework App</title>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<link rel='stylesheet' href={styles} />
				<link rel='icon' href='/favicon.ico' />
			</head>
			<body>
				<header>
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
				</header>
				<main>
					<Route path='/expensive-sum' component={withSuspense(ExpensiveSum)} />
					<Route path='/' component={withSuspense(HomePage)} />
				</main>
			</body>
		</html>
	);
}
