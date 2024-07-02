const priceFormatter = new Intl.NumberFormat("ru-RU", {
	style: "currency",
	currency: "RUB",
});

export default priceFormatter;
