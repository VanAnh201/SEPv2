import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import 'nprogress/nprogress.css';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from 'context/AuthProvider';
import Provider from 'utils/Provider';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

// Cấu hình NProgress
NProgress.configure({ showSpinner: false });

export default function MyApp({ Component, pageProps, session }) {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => {
			setLoading(true);
			NProgress.start();
		};
		const handleStop = () => {
			setLoading(false);
			NProgress.done();
		};

		Router.events.on('routeChangeStart', handleStart);
		Router.events.on('routeChangeComplete', handleStop);
		Router.events.on('routeChangeError', handleStop);

		return () => {
			Router.events.off('routeChangeStart', handleStart);
			Router.events.off('routeChangeComplete', handleStop);
			Router.events.off('routeChangeError', handleStop);
		};
	}, []);

	return (
		<div className='h-full'>
			<Head>
				<title>Runa: Incredible Places to Stay and Things to Do</title>
				<meta
					name='description'
					content='Find holiday rentals, cabins, beach houses, unique homes and experiences around the world – all made possible by Hosts on Airbnb.'
				/>
				<link rel='icon' href='images/logo.svg' />
			</Head>
			{loading && (
				<div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-white bg-opacity-50'>
					<div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
				</div>
			)}
			<Provider>
				<AuthProvider dynamic>
					<SessionProvider session={session}>
						<Component {...pageProps} />
						<ToastContainer />
					</SessionProvider>
				</AuthProvider>
			</Provider>
		</div>
	);
}
