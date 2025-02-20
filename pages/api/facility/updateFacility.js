import api from 'utils/api';

export const updateFacility = async (facilityData) => {
	try {
		const response = await api.put('/Facility/edit-facility', facilityData);
		return response.data;
	} catch (error) {
		console.error('Error updating facility:', error);
		throw error;
	}
};
