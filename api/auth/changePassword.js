import api from 'utils/api';

export const changePassword = async (email, oldPassword, newPassword) => {
	try {
		const response = await api.put('/Auth/change-password', {
			email,
			oldPassword,
			newPassword,
		});
		return response.data;
	} catch (error) {
		console.error('Error changing password:', error);
		throw error;
	}
};
