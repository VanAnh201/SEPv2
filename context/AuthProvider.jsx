'use client';
import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from 'pages/api/auth/getMe';
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

	const {
		data: dataProfile,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: () => getUserInfo(),
		refetchOnWindowFocus: true,
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
			<AuthContext.Provider value={{ isAuthenticated, login, logout, dataProfile, refetch }}>
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
