'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import AdminLayout from 'pages/admin/layout';
import { getHomeStayDetail } from 'pages/api/homestay/getHomeStayDetail';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const getPriceForToday = (calendar) => {
	const currentDate = new Date().toISOString().slice(0, 10);
	const todayPrice = calendar?.find((item) => item.date.slice(0, 10) === currentDate);
	return todayPrice ? todayPrice.price : null;
};

const UpdateHomeStay = () => {
	const { id } = useParams() ?? {};

	const { data, isLoading, error } = useQuery({
		queryKey: ['homeStayDetail', id],
		queryFn: () => getHomeStayDetail(id),
		enabled: !!id,
	});

	return (
		<AdminLayout>
			<div>
				{isLoading ? (
					<p className='text-center py-8 h-screen'>Loading...</p>
				) : error ? (
					<p className='text-center text-red-500 py-8'>Error fetching details</p>
				) : (
					<div className='p-4 sm:p-6 lg:p-8 bg-white rounded-2xl shadow-lg space-y-6'>
						<h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center'>{data?.name}</h2>

						<PhotoProvider>
							{data?.mainImage && (
								<PhotoView src={data.mainImage}>
									<img
										src={data.mainImage}
										alt='Main Homestay'
										className='w-full object-cover h-64 sm:h-80 lg:h-96 rounded-md cursor-pointer hover:opacity-90 transition'
									/>
								</PhotoView>
							)}

							<div className='grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4'>
								{data?.homeStayImage?.map((img, index) => (
									<PhotoView key={index} src={img.image}>
										<div className='border rounded-md'>
											<img
												src={img.image}
												alt={`Image ${index + 1}`}
												className='rounded-lg w-full object-cover cursor-pointer hover:opacity-90 transition'
											/>
										</div>
									</PhotoView>
								))}
							</div>
						</PhotoProvider>

						<div className='flex flex-col gap-3'>
							<p className='text-gray-600 text-base sm:text-lg leading-relaxed'>{data?.description}</p>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700'>
								<p>
									<strong>Address:</strong> {data?.address}
								</p>
								<p>
									<strong>City:</strong> {data?.city}
								</p>
							</div>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700'>
								<p>
									<strong>Check-In:</strong> {data?.checkInTime}
								</p>
								<p>
									<strong>Check-Out:</strong> {data?.checkOutTime}
								</p>
							</div>

							<div className='flex items-center gap-2'>
								<strong className='text-gray-800'>Price for Today:</strong>
								{getPriceForToday(data?.calendar) !== null ? (
									<p className='text-xl font-semibold text-green-600'>
										${getPriceForToday(data?.calendar)}
									</p>
								) : (
									<p className='text-xl font-semibold text-red-500'>Decommission</p>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default UpdateHomeStay;
