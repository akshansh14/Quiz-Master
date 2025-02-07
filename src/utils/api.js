import axios from "axios";

export const fetchQuizData = async () => {
	try {
		const response = await axios.get(
			`https://api.allorigins.win/raw?url=${encodeURIComponent(
				"https://api.jsonserve.com/Uw5CrX"
			)}`
		);
		return  response.data;
	} catch (error) {
		console.error("Error fetching quiz data:", error);
		throw error;
	}
};
