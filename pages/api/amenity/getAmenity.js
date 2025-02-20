import api from 'utils/api';

export const getAllAmenity = async () => {
	try {
		const response = await api.get('/Amenity/get-all-system-amenity');
		return response.data;
	} catch (error) {
		console.error('Error fetching system amenity:', error);
		throw error;
	}
};
