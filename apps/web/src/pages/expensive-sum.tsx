const n = 100e6;

function numberFormat(num: number): string {
	const formatter = new Intl.NumberFormat("en-US", {});
	return formatter.format(num);
}

const ExpensiveSum = () => {
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
			<h1>Sum of the first {numberFormat(n)} natural numbers:</h1>
			<p>{numberFormat(result)}</p>
		</div>
	);
};

export default ExpensiveSum;
