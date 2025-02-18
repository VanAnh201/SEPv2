import api from 'utils/api';

export const getHomeStayDetail = async (homeStayID) => {
	try {
		const response = await api.get(`/HomeStay/get-home-stay-detail`, {
			params: { homeStayID },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching home stay detail:', error);
		throw error;
	}
};
