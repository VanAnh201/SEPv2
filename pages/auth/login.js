'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

export default function LoginForm() {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			const response = await fetch('https://homestaybooking-001-site1.ntempurl.com/api/Auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				toast.success('Login successful! Redirecting to...');
				setTimeout(() => {
					router.push('/');
				}, 2000);
			} else {
				const errorData = await response.json();
				console.error('Login failed:', errorData);
				toast.error(`Login failed: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='relative flex items-center justify-center p-4 bg-gray-100 h-dvh'>
			<Image src='/images/authen/bg-authen.jpg' fill alt='bg-authen' />
			<Card className='relative z-50 w-full max-w-xl bg-white/80'>
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Sign in to your account.</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /\S+@\S+\.\S+/,
										message: 'Invalid email address',
									},
								})}
								className='border border-black'
								placeholder='john@example.com'
							/>
							{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									{...register('password', {
										required: 'Password is required',
										minLength: {
											value: 8,
											message: 'Password must be at least 8 characters long',
										},
									})}
									className='pr-10 border border-black'
									placeholder='*******'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute inset-y-0 flex items-center right-3'
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
							{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
						</div>
						<div className='mt-4 text-center'>
							<p>
								Don't have an account?{' '}
								<Link href='/auth/register'>
									<button className='text-blue-500 hover:underline'>Register</button>
								</Link>
							</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
