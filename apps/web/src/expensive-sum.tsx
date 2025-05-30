const ExpensiveSum = ({ n }: { n: number }) => {
	const calculateSum = (num: number) => {
		let total = 0;
		for (let i = 1; i <= num; i++) {
			total += i;
		}
		return total;
	};

	// This will run on every render, making it computationally expensive
	const result = calculateSum(n);

	return (
		<div>
			<h1>Sum of the first {n} natural numbers:</h1>
			<p>{result}</p>
		</div>
	);
};

export default ExpensiveSum;
