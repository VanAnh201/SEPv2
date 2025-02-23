'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import AdminLayout from 'pages/admin/layout';
import { getHomeStayDetail } from 'pages/api/homestay/getHomeStayDetail';
import { Button } from '@/components/components/ui/button';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Textarea } from '@/components/components/ui/textarea';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import 'react-datepicker/dist/react-datepicker.css';
import { editHomeStayInformation } from 'pages/api/homestay/updateHomeStay';
import { uploadImage } from 'pages/api/image/uploadImage';
import { uploadImages } from 'pages/api/homestay/uploadImageHomeStay';

const UpdateHomeStay = () => {
	const { id } = useParams() ?? {};
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery({
		queryKey: ['homeStayDetail', id],
		queryFn: () => getHomeStayDetail(id),
		enabled: !!id,
	});

	console.log('data', data);

	const [formData, setFormData] = useState({
		homeStayID: '',
		mainImage: '',
		homeStayImage: [],
		name: '',
		openIn: null,
		description: '',
		standar: 1,
		address: '',
		city: '',
		checkInTime: '',
		checkOutTime: '',
	});

	useEffect(() => {
		if (data) {
			setFormData({
				homeStayID: data.id,
				mainImage: data.mainImage || '',
				homeStayImage: data.homeStayImage || [],
				name: data.name || '',
				openIn: data.openIn ? new Date(data.openIn, 0) : null,
				description: data.description || '',
				standar: data.standar || 1,
				address: data.address || '',
				city: data.city || '',
				checkInTime: data.checkInTime || '',
				checkOutTime: data.checkOutTime || '',
			});
		}
	}, [data]);

	const mutation = useMutation({
		mutationFn: editHomeStayInformation,
		onSuccess: () => {
			queryClient.invalidateQueries(['homeStayDetail', id]);
			toast.success('Homestay updated successfully!');
		},
		onError: () => toast.error('Failed to update homestay.'),
	});

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'number' ? Number(value) : value,
		}));
	};

	const handleDateChange = (date, field) => {
		setFormData((prev) => ({ ...prev, [field]: date }));
	};

	const handleSubmit = () => {
		const updatedData = {
			...formData,
			openIn: formData.openIn ? formData.openIn.getFullYear() : 0,
		};
		mutation.mutate(updatedData);
	};

	const handleMainImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			const result = await uploadImage(file);
			setFormData((prev) => ({ ...prev, mainImage: result.url }));
			toast.success('Main image uploaded successfully!');
		} catch (err) {
			toast.error('Failed to upload main image.');
		}
	};

	const handleAdditionalImagesUpload = async (e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;

		try {
			const result = await uploadImages(files);
			setFormData((prev) => ({
				...prev,
				homeStayImage: [...prev.homeStayImage, ...result.urls],
			}));
			toast.success('Additional images uploaded successfully!');
		} catch (err) {
			toast.error('Failed to upload additional images.');
		}
	};

	if (isLoading) {
		return (
			<div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white bg-opacity-50 z-50'>
				<div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
			</div>
		);
	}

	if (error) {
		return <p className='text-center text-red-500 py-8'>Error fetching details</p>;
	}

	console.log('formData', formData);

	return (
		<AdminLayout>
			<div className='p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg space-y-6'>
				<h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center'>Edit Homestay</h2>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label>Main Image</Label>
						{formData.mainImage && (
							<PhotoProvider>
								<PhotoView src={formData.mainImage}>
									<img
										src={formData.mainImage}
										alt='Main Homestay'
										className='w-full object-cover h-64 rounded-md cursor-pointer hover:opacity-90 transition'
									/>
								</PhotoView>
							</PhotoProvider>
						)}
						<Input type='file' accept='image/*' onChange={handleMainImageUpload} className='mt-2' />
					</div>

					<div>
						<Label>Homestay Name</Label>
						<Input name='name' value={formData.name} onChange={handleChange} placeholder='Name' />
					</div>

					<div>
						<Label>Year Opened</Label>
						<DatePicker
							selected={formData.openIn}
							onChange={(date) => handleDateChange(date, 'openIn')}
							showYearPicker
							dateFormat='yyyy'
							placeholderText='Select Year'
							className='w-full px-2 py-1 border rounded'
						/>
					</div>

					<div>
						<Label>Description</Label>
						<Textarea
							name='description'
							value={formData.description}
							onChange={handleChange}
							placeholder='Description'
						/>
					</div>

					<div>
						<Label>Address</Label>
						<Textarea
							name='address'
							value={formData.address}
							onChange={handleChange}
							placeholder='Address'
						/>
					</div>

					<div>
						<Label>Standard (1-5)</Label>
						<Input
							name='standar'
							type='number'
							min={1}
							max={5}
							value={formData.standar}
							onChange={handleChange}
						/>
					</div>

					<div>
						<Label>City</Label>
						<Input name='city' value={formData.city} onChange={handleChange} placeholder='City' />
					</div>

					<div>
						<Label>Check-In Time</Label>
						<Input
							name='checkInTime'
							value={formData.checkInTime}
							onChange={handleChange}
							placeholder='Check-In Time'
						/>
					</div>

					<div>
						<Label>Check-Out Time</Label>
						<Input
							name='checkOutTime'
							value={formData.checkOutTime}
							onChange={handleChange}
							placeholder='Check-Out Time'
						/>
					</div>
				</div>

				<div>
					<Label>Additional Images</Label>
					<div className='grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 mb-4'>
						{formData.homeStayImage.map((img, index) => (
							<PhotoProvider key={index}>
								<PhotoView src={img.image}>
									<img
										src={img.image}
										alt={`Image ${index + 1}`}
										className='rounded-lg w-full object-cover cursor-pointer hover:opacity-90 transition'
									/>
								</PhotoView>
							</PhotoProvider>
						))}
					</div>
					<Input type='file' accept='image/*' multiple onChange={handleAdditionalImagesUpload} />
				</div>

				<div className='flex justify-end mt-6'>
					<Button onClick={handleSubmit} className='w-full'>
						{mutation.isLoading ? 'Updating...' : 'Update'}
					</Button>
				</div>
			</div>
		</AdminLayout>
	);
};

export default UpdateHomeStay;
