import axios from "axios";


export async function fetcher(url, options = []) {
	let response;
	if (!options) {
		response = await fetch(url);
	} else {
		response = await fetch(url, options);
	}
	const data = await response.json();
	return data;
}



const api = axios.create({
  baseURL: "http://localhost:3000"
});

export default api;