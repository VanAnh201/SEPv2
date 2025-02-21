import React, { useEffect, useState } from 'react';
import ManagerLayout from './layout';
import { useAuth } from 'context/AuthProvider';

const Admin = () => {
	const { isAuthenticated, dataProfile } = useAuth();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		if (!isAuthenticated) {
			window.location.href = '/auth/login';
		}
	}, [isAuthenticated]);

	if (!isClient || !isAuthenticated) {
		return null;
	}

	return <ManagerLayout>{dataProfile?.fullName}</ManagerLayout>;
};

export default Admin;
