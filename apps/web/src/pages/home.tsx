import React from "react";

export default function IndexPage() {
	const [count, setCount] = React.useState(0);
	return (
		<div>
			<h1>Welcome to the Index Page</h1>
			<p>This is the main entry point of the application.</p>
			<div>
				<p>Count: {count}</p>
				<button onClick={() => setCount(count + 1)}>Increment</button>
				<button onClick={() => setCount(count - 1)}>Decrement</button>
			</div>
		</div>
	);
}
