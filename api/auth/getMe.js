export const getUserInfo = async (userId) => {
	const url = 'https://homestaybooking-001-site1.ntempurl.com/api/Auth/get-me';

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: '*/*',
				'X-User-Id': userId,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();
		return data.Data;
	} catch (error) {
		console.error('Error fetching user info:', error);
		return null;
	}
};
