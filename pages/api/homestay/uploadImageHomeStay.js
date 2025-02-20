import api from 'utils/api';

export const uploadImages = async (files) => {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append('Files', file);
	});

	const response = await api.post('/Upload/upload-file-list', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});

	return response.data;
};
