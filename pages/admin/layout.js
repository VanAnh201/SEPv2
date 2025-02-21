import Head from 'next/head';
import React from 'react';
import { AppSidebarAmin } from '@/components/components/ui/app-sidebar-admin';
import { SidebarProvider, SidebarTrigger } from '@/components/components/ui/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = ({ children }) => {
	return (
		<div className='flex items-center justify-center bg-gray-100'>
			<Head>
				<title>Runa: Incredible Places to Stay and Things to Do</title>
				<meta
					name='description'
					content='Find holiday rentals, cabins, beach houses, unique homes and experiences around the world – all made possible by Hosts on Airbnb.'
				/>
				<link rel='icon' href='images/logo.svg' />
			</Head>
			<SidebarProvider>
				<AppSidebarAmin />
				<main className='w-full p-3 overflow-x-hidden'>
					<SidebarTrigger className='justify-start w-full' />
					{children}
					<ToastContainer />
				</main>
			</SidebarProvider>
		</div>
	);
};

export default AdminLayout;
