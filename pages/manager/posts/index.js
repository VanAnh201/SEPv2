import React from 'react';
import ManagerLayout from '../layout';
import { Button } from '@/components/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getAllPost } from 'pages/api/posts/getPosts';

const Post = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['posts'],
		queryFn: getAllPost,
	});
	console.log('data', data);

	return (
		<ManagerLayout>
			<div>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-semibold'>Post List</h2>
					<Button>Create Post</Button>
				</div>
				{isLoading ? (
					<div className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-white bg-opacity-50'>
						<div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
					</div>
				) : error ? (
					<p>Error: {error.message}</p>
				) : (
					<div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
						{data?.map((post) => (
							<div
								key={post.id}
								className='group [perspective:1000px] w-full h-[350px] overflow-y-hidden overflow-x-hidden'
							>
								<div className='relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]'>
									<div className='absolute w-full h-full backface-hidden [backface-visibility:hidden]'>
										<img
											src={post?.images?.[0]}
											className='object-cover w-full h-full rounded-lg shadow-lg cursor-pointer'
										/>
										<div className='text-[1.5rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white absolute bottom-5 left-1/2 w-full -translate-x-1/2 flex justify-center items-center flex-col bg-white/40'>
											<h2 className='text-[1.5rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.9)] font-bold text-white '>
												{post.title}
											</h2>
										</div>
									</div>

									<div className='absolute w-full h-full bg-white rounded-lg shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden] p-4 flex flex-col justify-between'>
										<div>
											<h2 className='text-[1.2rem] font-semibold text-gray-800'>{post.title}</h2>
											<span className='text-sm font-semibold text-gray-800'>
												{new Date(post.publishDate).toLocaleDateString()}
											</span>
											<p className='text-gray-600 line-clamp-1'>{post.location}</p>
											<p className='text-gray-600 line-clamp-2'>
												<strong>Description:</strong> {post?.description}
											</p>
										</div>
										<Button>View Detail</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</ManagerLayout>
	);
};

export default Post;
