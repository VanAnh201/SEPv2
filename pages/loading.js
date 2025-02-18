export default function Loading() {
	return (
		<div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white bg-opacity-50 z-50'>
			<div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
		</div>
	);
}
