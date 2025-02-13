'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Textarea } from '@/components/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
	const [isManager, setIsManager] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			const response = await fetch('https://homestaybooking-001-site1.ntempurl.com/api/Auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					roleId: isManager ? 2 : 1,
				}),
			});

			if (response.ok) {
				toast.success('Registration successful! Redirecting to login...');
				setTimeout(() => {
					router.push('/auth/login');
				}, 2000);
			} else {
				const errorData = await response.json();
				console.error('Registration failed:', errorData);
				toast.error(`Registration failed: ${errorData.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('An error occurred. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const password = watch('password');

	return (
		<div className='relative flex items-center justify-center h-full p-4 bg-gray-100'>
			<Image src='/images/authen/bg-authen.jpg' fill alt='bg-authen' />
			<Card className='relative z-50 w-full max-w-xl bg-white/80'>
				<CardHeader>
					<CardTitle>Register</CardTitle>
					<CardDescription>Create your account to get started.</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='fullName'>Full Name</Label>
							<Input
								id='fullName'
								{...register('fullName', { required: 'Full name is required' })}
								placeholder='John Doe'
								className='border border-black'
							/>
							{errors.fullName && <p className='text-sm text-red-500'>{errors.fullName.message}</p>}
						</div>
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
								placeholder='john@example.com'
								className='border border-black'
							/>
							{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>Phone</Label>
							<Input
								id='phone'
								type='tel'
								{...register('phone', {
									required: 'Phone number is required',
									pattern: {
										value: /^0\d{9}$/,
										message: 'Invalid phone number',
									},
								})}
								placeholder='0123-456-789'
								className='border border-black'
							/>
							{errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='address'>Address</Label>
							<Textarea
								id='address'
								{...register('address', { required: 'Address is required' })}
								placeholder='123 Main St, City, Country'
								className='border border-black'
							/>
							{errors.address && <p className='text-sm text-red-500'>{errors.address.message}</p>}
						</div>
						<div className='relative'>
							<Label htmlFor='password'>Password</Label>
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
								placeholder='*******'
								className='border border-black'
							/>
							<button
								type='button'
								className='absolute right-0 flex items-center px-3 top-1/2'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <EyeOff /> : <Eye />}
							</button>
							{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
						</div>

						{/* Confirm Password Field */}
						<div className='relative'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input
								id='confirmPassword'
								type={showConfirmPassword ? 'text' : 'password'}
								{...register('confirmPassword', {
									required: 'Confirm Password is required',
									validate: (value) => value === password || 'Passwords do not match',
								})}
								placeholder='*******'
								className='border border-black'
							/>
							<button
								type='button'
								className='absolute right-0 flex items-center px-3 top-1/2'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? <EyeOff /> : <Eye />}
							</button>
							{errors.confirmPassword && (
								<p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>
							)}
						</div>

						<div className='relative space-y-2'>
							<Label className='flex items-center gap-1'>
								<input
									type='checkbox'
									className='px-2 size-4'
									onChange={() => setIsManager(!isManager)}
								/>
								Register as Manager
							</Label>
						</div>

						<div className='mt-4 text-center'>
							<p>
								Already have an account?{' '}
								<Link href='/auth/login'>
									<button className='text-blue-500 hover:underline'>Login</button>
								</Link>
							</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? 'Registering...' : 'Register'}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
