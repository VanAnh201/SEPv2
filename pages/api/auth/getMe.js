import api from 'utils/api';

export const getUserInfo = async () => {
	try {
		const response = await api.get('/Auth/get-me');

		return response.data;
	} catch (error) {
		console.error('Error fetching the profile:', error.message);
		throw error;
	}
};
