import api from 'utils/api';

export const getAllHomeStay = async (filters) => {
	try {
		const response = await api.post('/HomeStay/get-all-home-stay', filters);
		return response.data;
	} catch (error) {
		console.error('Error fetching home stays:', error);
		throw error;
	}
};
