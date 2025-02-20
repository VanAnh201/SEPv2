import api from 'utils/api';

export const getAllFacility = async () => {
	try {
		const response = await api.get('/Facility/get-all');
		return response.data;
	} catch (error) {
		console.error('Error fetching home stays:', error);
		throw error;
	}
};
