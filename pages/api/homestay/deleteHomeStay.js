import api from 'utils/api';

export const deleteHomeStay = async (homeStayID) => {
	try {
		const response = await api.delete('/HomeStay/delete-home-stay', {
			params: { homeStayID },
		});
		return response.data;
	} catch (error) {
		console.error('Error deleting home stay:', error);
		throw error;
	}
};
