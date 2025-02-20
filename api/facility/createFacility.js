import api from 'utils/api';

export const createFacility = async (facilityData) => {
	try {
		const response = await api.post('/Facility/add-facility', [facilityData]);
		return response.data;
	} catch (error) {
		console.error('Error adding facility:', error);
		throw error;
	}
};
