import React, { useState } from 'react';
import ManagerLayout from '../layout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllHomeStay } from 'pages/api/homestay/getAllHomeStay';
import { Button } from '@/components/components/ui/button';
import { Checkbox } from '@/components/components/ui/checkbox';
import { Slider } from '@/components/components/ui/slider';
import { Car, Star, Wifi, PocketIcon as Pool, Trash2, Pencil } from 'lucide-react';
import { Label } from '@/components/components/ui/label';
import Link from 'next/link';
import { deleteHomeStay } from 'pages/api/homestay/deleteHomeStay';
import Swal from 'sweetalert2';

const Homestay = () => {
	const queryClient = useQueryClient();

	const [filters, setFilters] = useState({
		amenityNames: [],
		priceRange: [0, 1000],
		standard: [],
	});

	const { data, isLoading, error } = useQuery({
		queryKey: ['homeStays', filters],
		queryFn: () => getAllHomeStay(filters),
	});

	const handleCheckboxChange = (value, category) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[category]: prevFilters[category].includes(value)
				? prevFilters[category].filter((item) => item !== value)
				: [...prevFilters[category], value],
		}));
	};

	const handlePriceChange = (value) => {
		setFilters((prevFilters) => ({ ...prevFilters, priceRange: value }));
	};

	const homestay = data;

	const currentDate = new Date().toISOString().slice(0, 10);

	const getPriceForToday = (calendar) => {
		const todayPrice = calendar?.find((item) => item.date.slice(0, 10) === currentDate);
		return todayPrice ? todayPrice.price : null;
	};

	const deleteMutation = useMutation({
		mutationFn: deleteHomeStay,
		onSuccess: () => {
			queryClient.invalidateQueries(['homeStays']);
			Swal.fire({
				icon: 'success',
				title: 'Deleted!',
				text: 'The homestay has been deleted.',
				timer: 1500,
				showConfirmButton: false,
			});
		},
		onError: () => {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Failed to delete homestay. Please try again.',
			});
		},
	});

	const handleDelete = (homeStayID) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "This action can't be undone!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				deleteMutation.mutate(homeStayID);
			}
		});
	};

	return (
		<ManagerLayout>
			<div className='flex items-center justify-between mb-4'>
				<h1 className='text-2xl font-bold'>Homestay List</h1>
				<Link href='/manager/homestay/create'>
					<Button>Create Homestay</Button>
				</Link>
			</div>
			<div className='p-6 mb-6 bg-white rounded-lg shadow-md'>
				<h2 className='mb-4 text-xl font-semibold'>Filters</h2>
				<div className='space-y-6'>
					<div>
						<h3 className='mb-2 text-lg font-medium'>Price Range</h3>
						<Slider
							min={0}
							max={1000}
							step={10}
							value={filters.priceRange}
							onValueChange={handlePriceChange}
							className='w-full'
						/>
						<div className='flex justify-between mt-2 text-sm text-gray-600'>
							<span>${filters.priceRange[0]}</span>
							<span>${filters.priceRange[1]}</span>
						</div>
					</div>
					<div>
						<h3 className='mb-2 text-lg font-medium'>Amenities</h3>
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
							{[
								{ name: 'WiFi', icon: <Wifi className='w-4 h-4' /> },
								{ name: 'Parking', icon: <Car className='w-4 h-4' /> },
								{ name: 'Pool', icon: <Pool className='w-4 h-4' /> },
							].map((amenity) => (
								<div key={amenity.name} className='flex items-center space-x-2'>
									<Checkbox
										id={`amenity-${amenity.name}`}
										checked={filters.amenityNames.includes(amenity.name)}
										onCheckedChange={() => handleCheckboxChange(amenity.name, 'amenityNames')}
									/>
									<Label
										htmlFor={`amenity-${amenity.name}`}
										className='flex items-center space-x-2 cursor-pointer'
									>
										{amenity.icon}
										<span>{amenity.name}</span>
									</Label>
								</div>
							))}
						</div>
					</div>
					<div>
						<h3 className='mb-2 text-lg font-medium'>Standard</h3>
						<div className='flex flex-wrap gap-2'>
							{[1, 2, 3, 4, 5].map((std) => (
								<Label
									key={std}
									className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
										filters.standard.includes(std)
											? 'bg-primary text-primary-foreground'
											: 'bg-secondary hover:bg-secondary/80'
									}`}
									onClick={() => handleCheckboxChange(std, 'standard')}
								>
									<Star className='w-4 h-4' />
									<span>{std}</span>
								</Label>
							))}
						</div>
					</div>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p>Error: {error.message}</p>
			) : (
				<>
					<div className='grid grid-cols-1 gap-6 overflow-x-hidden sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{homestay?.map((homeStay) => {
							const priceForToday = getPriceForToday(homeStay.calendar);

							return (
								<div
									key={homeStay.id}
									className='group [perspective:1000px] w-full h-[380px] overflow-y-hidden overflow-x-hidden'
								>
									<div
										className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
											homeStay?.isDeleted ? '' : 'group-hover:[transform:rotateY(180deg)]'
										}`}
									>
										<div className='absolute w-full h-full backface-hidden [backface-visibility:hidden]'>
											<img
												src={homeStay?.mainImage}
												className='object-cover w-full h-full rounded-lg shadow-lg cursor-pointer'
											/>
											{homeStay?.isDeleted === true && (
												<div className='absolute px-2 py-1 rounded-md top-3 left-3 bg-rose-500'>
													<span className='text-sm [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white'>
														<span>Deleted</span>
													</span>
												</div>
											)}
											<div className='absolute top-3 right-3'>
												<span className='text-[1.2rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white'>
													{homeStay?.openIn}
												</span>
											</div>
											<div className='text-[1.5rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white absolute bottom-5 left-1/2 w-full -translate-x-1/2 flex justify-center items-center flex-col'>
												<h2 className='text-[1.5rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white '>
													{homeStay.name}
												</h2>
												<p className='flex items-center'>
													{[...Array(5)].map((_, index) => (
														<svg
															key={index}
															className={`w-5 h-5 ${
																homeStay.standar > index
																	? 'text-yellow-500'
																	: 'text-gray-300'
															}`}
															fill='currentColor'
															xmlns='http://www.w3.org/2000/svg'
															viewBox='0 0 20 20'
														>
															<path d='M10 15l-5.09 3.09 1.64-6.88L0 6.91l6.91-.59L10 0l2.09 6.32 6.91.59-4.55 4.3 1.64 6.88L10 15z' />
														</svg>
													))}
												</p>
											</div>
										</div>

										<div className='absolute w-full h-full bg-white rounded-lg shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden] p-4 flex flex-col gap-2'>
											<h2 className='text-[1.2rem] font-semibold text-gray-800'>
												{homeStay.name}
											</h2>
											<p className='text-gray-600 line-clamp-1'>
												{homeStay.address}, {homeStay.city}
											</p>
											<p className='text-gray-600'>
												<strong>Check-In:</strong> {homeStay.checkInTime}
											</p>
											<p className='text-gray-600'>
												<strong>Check-Out:</strong> {homeStay.checkOutTime}
											</p>
											<div>
												<strong>Price for Today:</strong>
												{priceForToday !== null ? (
													<p className='text-xl text-green-600'>${priceForToday}</p>
												) : (
													<p className='text-red-500'>Decommission</p>
												)}
											</div>
											<p className='text-gray-600 line-clamp-1'>
												<strong>Description:</strong> {homeStay?.description}
											</p>
											<div className='w-full'>
												<Link href={`/admin/homestay/${homeStay.id}`}>
													<Button className='w-full'>View Detail</Button>
												</Link>
											</div>
											<div className='flex items-center gap-3'>
												<Link href={`/admin/homestay/edit/${homeStay.id}`} className='w-1/2'>
													<Button className='w-full bg-green-500 hover:bg-green-700'>
														<Pencil />
													</Button>
												</Link>
												<Button
													variant='destructive'
													className='w-1/2'
													onClick={() => handleDelete(homeStay.id)}
													disabled={homeStay?.isDeleted === true}
												>
													<Trash2 />
												</Button>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</>
			)}
		</ManagerLayout>
	);
};

export default Homestay;
