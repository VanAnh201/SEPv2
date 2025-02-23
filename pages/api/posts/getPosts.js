import api from 'utils/api';

export const getAllPost = async () => {
	try {
		const response = await api.get('/Post/list');
		return response.data;
	} catch (error) {
		console.error('Error fetching posts:', error);
		throw error;
	}
};
