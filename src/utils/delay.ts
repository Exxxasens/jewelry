export default async function delay(time: number) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(true), time);
	});
}
