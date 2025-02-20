import React, { useState } from 'react';
import ManagerLayout from '../layout';
import { getAllAmenity } from 'pages/api/amenity/getAmenity';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/components/ui/dialog';
import { Label } from '@/components/components/ui/label';
import { Input } from '@/components/components/ui/input';
import { Textarea } from '@/components/components/ui/textarea';
import { Card, CardContent } from '@/components/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/components/ui/select';
import { Pencil, Trash2 } from 'lucide-react';

const Amenity = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const { data, isLoading, error } = useQuery({
		queryKey: ['amenity'],
		queryFn: getAllAmenity,
	});

	const openCreateDialog = () => {
		setDialogOpen(true);
	};

	const dataAmenity = data || [];
	const totalPages = Math.ceil(dataAmenity?.length / itemsPerPage);

	const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
	const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentData = dataAmenity.slice(startIndex, startIndex + itemsPerPage);

	return (
		<ManagerLayout>
			<div className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold'>Amenity List</h2>
					<Button onClick={openCreateDialog}>Create Amenity</Button>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>ss</DialogTitle>
								<DialogDescription>sss</DialogDescription>
							</DialogHeader>
							<form>
								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='name' className='text-right'>
											Name
										</Label>
										<Input id='name' name='name' className='col-span-3' required />
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='description' className='text-right'>
											Description
										</Label>
										<Textarea id='description' name='description' className='col-span-3' required />
									</div>
								</div>
								<DialogFooter>
									<Button type='submit'>Save changes</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				{isLoading ? (
					<div className='fixed top-0 left-0 flex items-center justify-center w-full h-full bg-white bg-opacity-50 z-50'>
						<div className='w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin'></div>
					</div>
				) : error ? (
					<p>Error: {error.message}</p>
				) : (
					<Card className='shadow-md rounded-2xl'>
						<CardContent className='p-4'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='w-1/6'>Name</TableHead>
										<TableHead className='w-2/6'>Home Stay Amenities</TableHead>
										<TableHead className='w-1/6'>isDeleted</TableHead>
										<TableHead className='w-1/6'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentData.length > 0 ? (
										currentData.map((facility) => (
											<TableRow key={facility.id}>
												<TableCell>{facility.name}</TableCell>
												<TableCell>
													{facility.homeStayAmenities === null && (
														<span>Not homestay amenity</span>
													)}
												</TableCell>
												<TableCell>
													{facility.isDeleted === false && <span>false</span>}
												</TableCell>
												<TableCell className='flex items-center gap-1'>
													<Button size='sm' onClick={() => openEditDialog(facility)}>
														<Pencil />
													</Button>
													<Button
														size='sm'
														variant='destructive'
														onClick={() => handleDelete(facility.id)}
													>
														<Trash2 />
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} className='text-center'>
												No facilities found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				)}
				<div className='flex justify-between items-center'>
					<div>
						<Select onValueChange={handleItemsPerPageChange} defaultValue={itemsPerPage.toString()}>
							<SelectTrigger className='w-20'>{itemsPerPage}</SelectTrigger>
							<SelectContent>
								{[5, 10, 15, 20].map((num) => (
									<SelectItem key={num} value={num.toString()}>
										{num}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='space-x-2'>
						<Button onClick={handlePrevPage} disabled={currentPage === 1}>
							Previous
						</Button>
						<span>
							Page {currentPage} of {totalPages}
						</span>
						<Button onClick={handleNextPage} disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</div>
			</div>
		</ManagerLayout>
	);
};

export default Amenity;
