import React from "react";
import "./style.css";
import typescriptLogo from "/typescript.svg";

export default function App() {
	const [count, setCount] = React.useState(0);

	return (
		<RootDocument>
			<>
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
					<button
						id='counter'
						type='button'
						onClick={() => setCount(count + 1)}
					>
						{count}
					</button>
				</div>
			</>
		</RootDocument>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<title>Framework App</title>
			</head>
			<body>{children}</body>
		</html>
	);
}
