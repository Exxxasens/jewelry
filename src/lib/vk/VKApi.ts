import axios from "axios";

export default class VKApi {
	url = "https://api.vk.ru";
	baseParams = {
		v: "5.199",
	};
	accessToken: string;

	constructor(key: string) {
		this.accessToken = key;
	}

	appendParams(payload: object, params: URLSearchParams) {
		Object.entries(payload).map(([key, value]) => {
			params.append(String(key), String(value));
		});
	}

	getRequest<R = unknown>(method: string, params: URLSearchParams) {
		// append base params...
		this.appendParams(this.baseParams, params);

		return axios.get<R>(
			this.url + "/method/" + method + "?" + params.toString(),
			{
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
				},
			},
		);
	}
}
