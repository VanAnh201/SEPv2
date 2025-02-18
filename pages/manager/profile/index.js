'use client';

import { useEffect, useState } from 'react';
import ManagerLayout from '../layout';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Label } from '@/components/components/ui/label';
import { Input } from '@/components/components/ui/input';
import { Button } from '@/components/components/ui/button';
import { useAuth } from 'context/AuthProvider';
import { Textarea } from '@/components/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { updateProfile } from 'api/auth/updateProfile';
import { Eye, EyeOff } from 'lucide-react';
import { changePassword } from 'api/auth/changePassword';

export default function ProfilePage() {
	const { dataProfile } = useAuth();
	const queryClient = useQueryClient();

	const [profile, setProfile] = useState({
		fullName: '',
		email: '',
		phone: '',
		address: '',
		roleId: '',
	});

	useEffect(() => {
		if (dataProfile) {
			setProfile({
				fullName: dataProfile.fullName || '',
				email: dataProfile.email || '',
				phone: dataProfile.phone || '',
				address: dataProfile.address || '',
				roleId: dataProfile.roleId || '',
			});
		}
	}, [dataProfile]);

	const [passwordData, setPasswordData] = useState({
		oldPassword: '',
		newPassword: '',
	});

	const [showPassword, setShowPassword] = useState({
		oldPassword: false,
		newPassword: false,
	});

	const [isEditing, setIsEditing] = useState(false);

	const {
		mutate: mutateUpdateProfile,
		isLoading,
		isError,
		error,
	} = useMutation({
		mutationFn: async (profileData) => {
			const response = await updateProfile(dataProfile.id, profileData);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataProfile'] });
			Swal.fire({
				title: 'Success!',
				text: 'Profile updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
			setIsEditing(false);
		},
		onError: (error) => {
			console.error('Error updating profile:', error);
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating your profile.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleProfileChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	const toggleShowPassword = (field) => {
		setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handlePasswordChange = (e) => {
		setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
	};

	const handleProfileSubmit = (e) => {
		e.preventDefault();

		if (!isEditing) {
			setIsEditing(true);
			return;
		}

		mutateUpdateProfile(profile);
	};

	const { mutate: mutateChangePassword, isLoading: changePassLoading } = useMutation({
		mutationFn: async ({ email, oldPassword, newPassword }) => {
			return await changePassword(email, oldPassword, newPassword);
		},
		onSuccess: () => {
			toast.success('Your password has been successfully updated.');
			setPasswordData({ oldPassword: '', newPassword: '' });
		},
		onError: (error) => {
			const errorMessage = error.response?.data?.message || 'Failed to change password.';
			toast.error(errorMessage);
		},
	});

	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		if (!passwordData.oldPassword || !passwordData.newPassword) {
			toast.warning('Please fill in all fields.');
			return;
		}
		mutateChangePassword({
			email: dataProfile.email,
			oldPassword: passwordData.oldPassword,
			newPassword: passwordData.newPassword,
		});
	};

	return (
		<ManagerLayout>
			<div className='flex flex-col gap-2'>
				<h1 className='text-2xl font-bold'>Profile</h1>
				<div className='grid gap-4 md:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleProfileSubmit} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='fullName'>Full Name</Label>
									<Input
										id='fullName'
										name='fullName'
										value={profile.fullName}
										onChange={handleProfileChange}
										disabled={!isEditing}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										name='email'
										type='email'
										value={profile.email}
										onChange={handleProfileChange}
										disabled={!isEditing}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='phone'>Phone</Label>
									<Input
										id='phone'
										name='phone'
										type='tel'
										value={profile.phone}
										onChange={handleProfileChange}
										disabled={!isEditing}
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='address'>Address</Label>
									<Textarea
										id='address'
										name='address'
										value={profile.address}
										onChange={handleProfileChange}
										disabled={!isEditing}
									/>
								</div>
								<Button type='submit' disabled={isLoading}>
									{isEditing ? 'Save Changes' : 'Update Profile'}
								</Button>
								{isError && (
									<p className='text-sm text-red-500'>Error: {error?.message || 'Unknown error'}</p>
								)}
							</form>
						</CardContent>
					</Card>

					<Card className='h-fit'>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePasswordSubmit} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='oldPassword'>Old Password</Label>
									<div className='relative'>
										<Input
											id='oldPassword'
											name='oldPassword'
											type={showPassword.oldPassword ? 'text' : 'password'}
											value={passwordData.oldPassword}
											onChange={handlePasswordChange}
											required
											placeholder='*******'
										/>
										<button
											type='button'
											className='absolute transform -translate-y-1/2 right-2 top-1/2'
											onClick={() => toggleShowPassword('oldPassword')}
										>
											{showPassword.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='newPassword'>New Password</Label>
									<div className='relative'>
										<Input
											id='newPassword'
											name='newPassword'
											type={showPassword.newPassword ? 'text' : 'password'}
											value={passwordData.newPassword}
											onChange={handlePasswordChange}
											required
											placeholder='*******'
										/>
										<button
											type='button'
											className='absolute transform -translate-y-1/2 right-2 top-1/2'
											onClick={() => toggleShowPassword('newPassword')}
										>
											{showPassword.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</button>
									</div>
								</div>
								<Button type='submit' disabled={changePassLoading}>
									{changePassLoading ? 'Changing...' : 'Change Password'}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</ManagerLayout>
	);
}
