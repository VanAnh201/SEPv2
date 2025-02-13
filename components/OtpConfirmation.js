'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

export default function OtpConfirmation({ email }) {
	const [isConfirmed, setIsConfirmed] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		// Here you would typically send the OTP to your backend for verification
		console.log('OTP submitted:', data);
		// Simulate a successful OTP confirmation
		setIsConfirmed(true);
	};

	if (isConfirmed) {
		return (
			<div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
				<Card className='w-full max-w-md'>
					<CardHeader>
						<CardTitle>Account Confirmed</CardTitle>
						<CardDescription>Your account has been successfully confirmed.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>You can now log in with your email and password.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Confirm Your Account</CardTitle>
					<CardDescription>Enter the OTP sent to {email}</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='otp'>One-Time Password</Label>
							<Input
								id='otp'
								{...register('otp', {
									required: 'OTP is required',
									pattern: {
										value: /^\d{6}$/,
										message: 'OTP must be 6 digits',
									},
								})}
								placeholder='Enter 6-digit OTP'
							/>
							{errors.otp && <p className='text-red-500 text-sm'>{errors.otp.message}</p>}
						</div>
					</CardContent>
					<CardFooter>
						<Button type='submit' className='w-full'>
							Confirm Account
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
