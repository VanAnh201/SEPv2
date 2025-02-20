import api from 'utils/api';

export const deleteFacility = async (id) => {
	try {
		const response = await api.delete('/Facility/delete-facility', {
			data: { id: [id] },
		});
		return response.data;
	} catch (error) {
		console.error('Error deleting facility:', error);
		throw error;
	}
};
