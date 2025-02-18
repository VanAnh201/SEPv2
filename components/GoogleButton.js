'use client';
import { useState, useEffect } from 'react';
import { auth, provider, signInWithPopup, signOut } from 'utils/firebase';

export default function GoogleSignInButton() {
	const [user, setUser] = useState(null);

	console.log('user', user);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setUser(user);
		});
	}, []);

	const handleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			setUser(result.user);
		} catch (error) {
			console.error('Google Sign-in Error:', error);
		}
	};

	const handleLogout = async () => {
		await signOut(auth);
		setUser(null);
	};

	return (
		<div className='flex justify-center items-center'>
			{user ? (
				<div className='flex items-center space-x-4'>
					<img src={user.photoURL} alt='Profile' className='w-10 h-10 rounded-full' />
					<span>{user.displayName}</span>
					<button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded-lg'>
						Sign Out
					</button>
				</div>
			) : (
				<button onClick={handleLogin} className='bg-blue-500 text-white px-4 py-2 rounded-lg'>
					Sign in with Google
				</button>
			)}
		</div>
	);
}
