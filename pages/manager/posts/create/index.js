import React, { useState } from 'react';
import ManagerLayout from '../layout';
import { useAuth } from 'context/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from 'pages/api/posts/createPost';
import { Input } from '@/components/components/ui/input';
import { Button } from '@/components/components/ui/button';
import { uploadImages } from 'pages/api/homestay/uploadImageHomeStay';
import { Label } from '@/components/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';

const MAX_IMAGES = 5;

const createPost = () => {
	const { dataProfile } = useAuth();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		location: '',
		images: [],
	});

	const mutation = useMutation({
		mutationFn: (postData) => createPost(dataProfile.id, postData),
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
			toast.success('Post created successfully!');
			setFormData({ title: '', description: '', location: '', images: [] });
		},
		onError: () => {
			toast.error('Failed to create post. Please try again.');
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.title || !formData.description || !formData.location) {
			toast.warning('Please fill in all fields.');
			return;
		}
		mutation.mutate(formData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
			if (!response?.urls?.length) throw new Error('Invalid upload response.');

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...response.urls],
			}));
			toast.success('Images uploaded successfully!');
		} catch (error) {
			console.error('Image upload failed:', error);
			toast.error('Failed to upload images.');
		}

		if (filesToAdd.length < files.length) {
			toast.warning(`Only ${remainingSlots} image(s) added. Max ${MAX_IMAGES} images allowed.`);
		}
	};

	const handleDeleteImage = (indexToDelete) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, index) => index !== indexToDelete),
		}));
	};

	return (
		<ManagerLayout>
			<div className=''>
				<h2 className='mb-4 text-2xl font-bold'>Create a New Post</h2>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<Input name='title' placeholder='Title' value={formData.title} onChange={handleChange} required />
					<Input
						name='description'
						placeholder='Description'
						value={formData.description}
						onChange={handleChange}
						required
					/>
					<Input
						name='location'
						placeholder='Location'
						value={formData.location}
						onChange={handleChange}
						required
					/>

					<div>
						<Label className='block mb-2 font-medium'>Images</Label>
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
										className='object-cover w-full rounded-lg aspect-square'
									/>
									<button
										onClick={() => handleDeleteImage(index)}
										className='absolute p-1 rounded-full opacity-0 top-1 right-1 bg-black/50 group-hover:opacity-100'
									>
										<X className='w-4 h-4 text-white' />
									</button>
								</div>
							))}
							{formData.images.length < MAX_IMAGES && (
								<div
									onClick={() => document.getElementById('imagesInput').click()}
									className='flex items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer aspect-square hover:bg-gray-50'
								>
									<ImagePlus className='w-8 h-8 text-gray-400' />
								</div>
							)}
						</div>
					</div>

					<Button type='submit' className='w-full' disabled={mutation.isLoading}>
						{mutation.isLoading ? 'Posting...' : 'Create Post'}
					</Button>
				</form>
			</div>
		</ManagerLayout>
	);
};

export default createPost;
