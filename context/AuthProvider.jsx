'use client';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from 'api/auth/getMe';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Provider from 'utils/Provider';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(
		typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
	);

	const login = ({ accessToken, refreshToken }) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			setIsAuthenticated(true);
		}
	};

	const logout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			setIsAuthenticated(false);
			router.push('/auth/login');
		}
	};

	const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
	let userId = null;
	if (accessToken) {
		try {
			const decoded = jwtDecode(accessToken);
			userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
		} catch (error) {
			console.error('Error decoding token:', error);
		}
	}

	const {
		data: dataProfile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: () => getUserInfo(userId),
		enabled: !!userId,
	});

	useEffect(() => {
		if (isAuthenticated && !isLoading && dataProfile) {
			if (dataProfile.role === 'Admin' || dataProfile.role === 'Manager') {
				return;
			}
			toastr.error('Bạn không có quyền truy cập vào trang này!');
			router.push('/');
		}
	}, [isAuthenticated, dataProfile, isLoading, router]);

	return (
		<Provider>
			<AuthContext.Provider value={{ isAuthenticated, login, logout, dataProfile }}>
				{children}
			</AuthContext.Provider>
		</Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
