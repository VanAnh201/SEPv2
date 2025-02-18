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

const MAX_IMAGES = 8;

const CreateHomeStay = () => {
	const [formData, setFormData] = useState({
		mainImage: null,
		name: '',
		openIn: '',
		description: '',
		standard: 1,
		address: '',
		city: '',
		isBlocked: false,
		checkInTime: '',
		checkOutTime: '',
		images: [],
		price: '',
		isDeleted: false,
		dateAttachment: '',
	});

	const fileInputRef = useRef(null);
	const multipleFileInputRef = useRef(null);
	const singleFileInputRef = useRef(null);

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData({
			...formData,
			[name]: type === 'number' ? Number(value) : value,
		});
	};

	const handleMainImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, mainImage: URL.createObjectURL(file) });
		}
	};

	const handleDeleteImage = (indexToDelete) => {
		setFormData({
			...formData,
			images: formData.images.filter((_, index) => index !== indexToDelete),
		});
	};

	const handleImagesChange = (e, multiple = false) => {
		const files = multiple ? Array.from(e.target.files) : [e.target.files[0]];
		const remainingSlots = MAX_IMAGES - formData.images.length;
		const filesToAdd = files.slice(0, remainingSlots);
		const imageUrls = files.map((file) => URL.createObjectURL(file));
		setFormData({ ...formData, images: [...formData.images, ...imageUrls] });

		if (filesToAdd.length < files.length) {
			toast({
				title: 'Image limit reached',
				description: `Only ${remainingSlots} image(s) added. Maximum of ${MAX_IMAGES} images allowed.`,
				variant: 'warning',
			});
		}
	};

	const handleSubmit = () => {
		onClose();
	};

	const handleDateChange = (date, field) => {
		setFormData({
			...formData,
			[field]: date,
		});
	};

	return (
		<ManagerLayout>
			<div className=''>
				<div className='p-4 space-y-4'>
					<h2 className='text-xl font-bold'>Create Homestay</h2>

					<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
						<div className='h-full'>
							<Label className='block font-medium mb-2'>Main Image</Label>
							<Input
								type='file'
								accept='image/*'
								onChange={handleMainImageChange}
								className='hidden'
								ref={fileInputRef}
							/>
							<div
								onClick={() => fileInputRef.current?.click()}
								className='cursor-pointer border-2 border-dashed p-3 rounded-md hover:bg-gray-50 transition-colors'
							>
								{formData.mainImage ? (
									<div className='relative w-full h-96 rounded-lg overflow-hidden hover:opacity-90 transition-opacity'>
										<img
											src={formData.mainImage || '/placeholder.svg'}
											alt='Main'
											className='w-full h-96 object-contain'
										/>
									</div>
								) : (
									<div className='w-full h-96 rounded-lg flex items-center justify-center'>
										<ImagePlus className='w-8 h-8 text-gray-400' />
									</div>
								)}
							</div>
						</div>

						<div>
							<Label className='block font-medium mb-2'>Images</Label>
							<input
								type='file'
								accept='image/*'
								multiple
								onChange={(e) => handleImagesChange(e, true)}
								className='hidden'
								ref={multipleFileInputRef}
							/>
							<input
								type='file'
								accept='image/*'
								onChange={(e) => handleImagesChange(e, false)}
								className='hidden'
								ref={singleFileInputRef}
							/>
							<div className='grid grid-cols-4 gap-4'>
								{formData.images.map((img, index) => (
									<div key={index} className='relative group'>
										<img
											src={img || '/placeholder.svg'}
											alt={`Preview ${index}`}
											className='w-full aspect-square object-cover rounded-lg'
										/>
										<button
											onClick={() => handleDeleteImage(index)}
											className='absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
										>
											<X className='w-4 h-4 text-white' />
										</button>
									</div>
								))}

								{formData.images.length < MAX_IMAGES && (
									<div
										onClick={() => multipleFileInputRef.current?.click()}
										className='w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'
									>
										<ImagePlus className='w-8 h-8 text-gray-400' />
									</div>
								)}
							</div>
							{formData.images.length >= MAX_IMAGES && (
								<p className='text-sm text-yellow-600 mt-2'>Maximum number of images reached (8)</p>
							)}
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label className='block font-medium mb-2'>Homestay Name</Label>
							<Input
								name='name'
								placeholder='Homestay Name'
								value={formData.name}
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label className='block font-medium mb-2'>Year Opened</Label>
							<DatePicker
								selected={formData.openIn}
								onChange={(date) => handleDateChange(date, 'openIn')}
								showYearPicker
								dateFormat='yyyy'
								yearItemNumber={9}
								className='w-full px-2 py-1 border rounded bg-transparent placeholder:text-sm'
								placeholderText='Select Year'
								withPortal
							/>
							{/* <Input
								name='openIn'
								type='number'
								placeholder='Year Opened'
								value={formData.openIn}
								onChange={handleChange}
							/> */}
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
								name='standard'
								type='number'
								placeholder='Standard Level'
								value={formData.standard}
								onChange={handleChange}
								min={1}
								max={5}
							/>
						</div>

						<div>
							<Label className='block font-medium mb-2'>City</Label>
							<Input name='city' placeholder='City' value={formData.city} onChange={handleChange} />
						</div>

						<div>
							<Label className='block font-medium mb-2'>Check-In Time</Label>
							<DatePicker
								withPortal
								selected={formData.checkInTime}
								onChange={(date) => handleDateChange(date, 'checkInTime')}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								timeCaption='Time'
								dateFormat='h:mm aa'
								className='w-full px-2 py-1 border rounded bg-transparent placeholder:text-sm'
								placeholderText='Check-In Time'
							/>
						</div>
						<div>
							<Label className='block font-medium mb-2'>Check-Out Time</Label>
							<DatePicker
								withPortal
								selected={formData.checkOutTime}
								onChange={(date) => handleDateChange(date, 'checkOutTime')}
								showTimeSelect
								showTimeSelectOnly
								timeIntervals={15}
								timeCaption='Time'
								dateFormat='h:mm aa'
								className='w-full px-2 py-1 border rounded bg-transparent placeholder:text-sm'
								placeholderText='Check-Out Time'
							/>
						</div>

						<div>
							<Label className='block font-medium mb-2'>Price</Label>
							<Input
								name='price'
								type='number'
								placeholder='Price'
								value={formData.price}
								onChange={handleChange}
							/>
						</div>

						<div>
							<Label className='block font-medium mb-2'>Date</Label>
							<DatePicker
								withPortal
								selected={formData.dateAttachment}
								onChange={(date) => handleDateChange(date, 'dateAttachment')}
								className='w-full px-2 py-1 border rounded bg-transparent placeholder:text-sm'
								placeholderText='Date'
							/>
						</div>
					</div>

					<div className='flex justify-end mt-4 w-full'>
						<Button variant='default' onClick={handleSubmit} className='w-full'>
							Create
						</Button>
					</div>
				</div>
			</div>
		</ManagerLayout>
	);
};

export default CreateHomeStay;
