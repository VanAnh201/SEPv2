import { Button } from '@/components/components/ui/button';
import { Checkbox } from '@/components/components/ui/checkbox';
import { Input } from '@/components/components/ui/input';
import { Label } from '@/components/components/ui/label';
import { Textarea } from '@/components/components/ui/textarea';
import { ImagePlus, X } from 'lucide-react';
import ManagerLayout from 'pages/manager/layout';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from 'context/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHomeStay } from 'pages/api/homestay/createHomeStay';
import { uploadImage } from 'pages/api/image/uploadImage';
import { uploadImages } from 'pages/api/homestay/uploadImageHomeStay';

const MAX_IMAGES = 8;

const CreateHomeStay = () => {
	const { dataProfile } = useAuth();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		mainImage: '',
		name: '',
		openIn: '',
		description: '',
		standar: 1,
		address: '',
		city: '',
		isBlocked: false,
		checkInTime: '',
		checkOutTime: '',
		images: [],
		price: '',
		isDeleted: false,
		date: '',
	});

	const mutation = useMutation({
		mutationFn: (homeStayData) => createHomeStay(dataProfile.id, homeStayData),
		onSuccess: () => {
			queryClient.invalidateQueries(['homeStays']);
			toast.success('Homestay created successfully!');
			setFormData({
				mainImage: '',
				name: '',
				openIn: '',
				description: '',
				standar: 1,
				address: '',
				city: '',
				isBlocked: false,
				checkInTime: '',
				checkOutTime: '',
				images: [],
				price: '',
				isDeleted: false,
				date: '',
			});
		},
		onError: () => {
			toast.error('Failed to create homestay. Please try again.');
		},
	});

	const handleSubmit = () => {
		const homeStayData = {
			...formData,
			openIn: formData.openIn ? formData.openIn.getFullYear() : '',
			checkInTime: formData.checkInTime
				? formData.checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
				: '',
			checkOutTime: formData.checkOutTime
				? formData.checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
				: '',
			date: formData.date ? formData.date.toISOString().split('T')[0] : '',
		};

		mutation.mutate(homeStayData);
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData({
			...formData,
			[name]: type === 'number' ? Number(value) : value,
		});
	};

	const handleMainImageChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			try {
				const uploadedImageUrl = await uploadImage(file);
				setFormData((prev) => ({ ...prev, mainImage: uploadedImageUrl.url }));
				toast.success('Main image uploaded successfully!');
			} catch (error) {
				console.error('Image upload failed:', error);
				toast.error('Failed to upload main image.');
			}
		}
	};

	const handleImagesChange = async (e) => {
		const files = Array.from(e.target.files);
		const remainingSlots = MAX_IMAGES - formData.images.length;
		const filesToAdd = files.slice(0, remainingSlots);

		if (!filesToAdd.length) {
			toast.warning(`You can only add up to ${MAX_IMAGES} images.`);
			return;
		}

		try {
			const response = await uploadImages(filesToAdd);
			console.log('Image upload response:', response);

			if (!response || !response.urls || !Array.isArray(response.urls)) {
				throw new Error('Image upload response is not a valid array of URLs.');
			}

			const imageUrls = response.urls.filter((url) => typeof url === 'string');

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...imageUrls],
			}));
			toast.success('Images uploaded successfully!');
		} catch (error) {
			console.error('Image upload failed:', error);
			toast.error('Failed to upload images.');
		}

		if (filesToAdd.length < files.length) {
			toast.warning(`Only ${remainingSlots} image(s) added. Maximum of ${MAX_IMAGES} images allowed.`);
		}
	};

	const handleDeleteImage = (indexToDelete) => {
		setFormData({
			...formData,
			images: formData.images.filter((_, index) => index !== indexToDelete),
		});
	};

	const handleDateChange = (date, field) => {
		setFormData({
			...formData,
			[field]: date,
		});
	};

	console.log('formData', formData);

	return (
		<ManagerLayout>
			<div className='p-4 space-y-4'>
				<h2 className='text-xl font-bold'>Create Homestay</h2>
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
					<div className='h-full'>
						<Label className='block font-medium mb-2'>Main Image</Label>
						<Input type='file' accept='image/*' onChange={handleMainImageChange} className='hidden' />
						<div
							onClick={() => document.querySelector("input[type='file']").click()}
							className='cursor-pointer border-2 border-dashed p-3 rounded-md hover:bg-gray-50'
						>
							{formData.mainImage ? (
								<img
									src={formData.mainImage}
									alt='Main'
									className='w-full h-96 object-contain rounded-lg'
								/>
							) : (
								<div className='w-full h-96 flex items-center justify-center'>
									<ImagePlus className='w-8 h-8 text-gray-400' />
								</div>
							)}
						</div>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Images</Label>
						<Input
							type='file'
							accept='image/*'
							multiple
							onChange={handleImagesChange}
							className='hidden'
							id='imagesInput'
						/>
						<div className='grid grid-cols-4 gap-4'>
							{formData.images.map((url, index) => (
								<div key={index} className='relative group'>
									<img
										src={url}
										alt={`Preview ${index}`}
										className='w-full aspect-square object-cover rounded-lg'
									/>
									<button
										onClick={() => handleDeleteImage(index)}
										className='absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100'
									>
										<X className='w-4 h-4 text-white' />
									</button>
								</div>
							))}
							{formData.images.length < MAX_IMAGES && (
								<div
									onClick={() => document.getElementById('imagesInput').click()}
									className='w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50'
								>
									<ImagePlus className='w-8 h-8 text-gray-400' />
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label className='block font-medium mb-2'>Homestay Name</Label>
						<Input name='name' placeholder='Homestay Name' value={formData.name} onChange={handleChange} />
					</div>
					<div>
						<Label className='block font-medium mb-2'>Year Opened</Label>
						<DatePicker
							selected={formData.openIn}
							onChange={(date) => handleDateChange(date, 'openIn')}
							showYearPicker
							dateFormat='yyyy'
							placeholderText='Select Year'
							className='w-full px-2 py-1 border rounded bg-transparent'
						/>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Description</Label>
						<Textarea
							name='description'
							placeholder='Description'
							value={formData.description}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Address</Label>
						<Textarea
							name='address'
							placeholder='Address'
							value={formData.address}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Standard (1-5)</Label>
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
						<Label className='block font-medium mb-2'>City</Label>
						<Input name='city' placeholder='City' value={formData.city} onChange={handleChange} />
					</div>
					<div>
						<Label className='block font-medium mb-2'>Check-In Time</Label>
						<DatePicker
							selected={formData.checkInTime}
							onChange={(date) => handleDateChange(date, 'checkInTime')}
							showTimeSelect
							showTimeSelectOnly
							timeIntervals={15}
							timeCaption='Time'
							dateFormat='h:mm aa'
							placeholderText='Check-In Time'
							className='w-full px-2 py-1 border rounded bg-transparent'
						/>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Check-Out Time</Label>
						<DatePicker
							selected={formData.checkOutTime}
							onChange={(date) => handleDateChange(date, 'checkOutTime')}
							showTimeSelect
							showTimeSelectOnly
							timeIntervals={15}
							timeCaption='Time'
							dateFormat='h:mm aa'
							placeholderText='Check-Out Time'
							className='w-full px-2 py-1 border rounded bg-transparent'
						/>
					</div>
					<div>
						<Label className='block font-medium mb-2'>Price</Label>
						<Input name='price' placeholder='Price' value={formData.price} onChange={handleChange} />
					</div>
					<div>
						<Label className='block font-medium mb-2'>Date</Label>
						<DatePicker
							selected={formData.date}
							onChange={(date) => handleDateChange(date, 'date')}
							placeholderText='Date'
							className='w-full px-2 py-1 border rounded bg-transparent'
						/>
					</div>
				</div>

				<div className='flex justify-end mt-4'>
					<Button variant='default' onClick={handleSubmit} className='w-full'>
						{mutation.isLoading ? 'Creating...' : 'Create'}
					</Button>
				</div>
			</div>
		</ManagerLayout>
	);
};

export default CreateHomeStay;
