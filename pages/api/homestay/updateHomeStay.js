import api from 'utils/api';

export const editHomeStayInformation = async (homeStayData) => {
	try {
		const response = await api.put('/HomeStay/edit-home-stay-information', homeStayData);
		return response.data;
	} catch (error) {
		console.error('Error editing home stay information:', error);
		throw error;
	}
};
