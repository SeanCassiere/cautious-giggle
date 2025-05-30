import React from "react";
import "./style.css";
import typescriptLogo from "/typescript.svg";

const ExpensiveSum = React.lazy(() => import("./expensive-sum"));

export default function App() {
	const [count, setCount] = React.useState(0);

	return (
		<RootDocument>
			<a href='https://vitejs.dev' target='_blank'>
				<img src='/vite.svg' className='logo' alt='Vite logo' />
			</a>
			<a href='https://www.typescriptlang.org/' target='_blank'>
				<img
					src={typescriptLogo}
					className='logo vanilla'
					alt='TypeScript logo'
				/>
			</a>
			<header id='header'>
				<h1>Web</h1>
			</header>

			<div className='card'>
				<button id='counter' type='button' onClick={() => setCount(count + 1)}>
					{count}
				</button>
			</div>
			<React.Suspense fallback={<div>loading...</div>}>
				<ExpensiveSum n={10000000 + count} />
			</React.Suspense>
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
