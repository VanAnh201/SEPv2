import api from 'utils/api';

export const updateProfile = async (id, profileData) => {
	try {
		const response = await api.put(`/User/${id}`, profileData);
		return response.data;
	} catch (error) {
		console.error('Error updating profile:', error);
		throw error;
	}
};
