import React, { useState } from 'react';
import ManagerLayout from '../layout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllFacility } from 'pages/api/facility/getFacility';
import { Card, CardContent } from '@/components/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/components/ui/table';
import { Button } from '@/components/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/components/ui/dialog';
import { Label } from '@/components/components/ui/label';
import { Input } from '@/components/components/ui/input';
import { Pencil, Trash2 } from 'lucide-react';
import { createFacility } from 'pages/api/facility/createFacility';
import Swal from 'sweetalert2';
import { updateFacility } from 'pages/api/facility/updateFacility';
import { Textarea } from '@/components/components/ui/textarea';
import { deleteFacility } from 'pages/api/facility/deleteFacility';

const Facility = () => {
	const queryClient = useQueryClient();
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });

	const { data, isLoading, error } = useQuery({
		queryKey: ['facilities'],
		queryFn: getAllFacility,
	});

	const createFacilityMutation = useMutation({
		mutationFn: createFacility,
		onSuccess: () => {
			queryClient.invalidateQueries(['facilities']);
			setDialogOpen(false);
			setFormData({ name: '', description: '' });
			Swal.fire({
				icon: 'success',
				title: 'Facility Created',
				text: 'The facility has been created successfully.',
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: (error) => {
			console.error('Failed to create facility:', error);
			Swal.fire({
				icon: 'error',
				title: 'Creation Failed',
				text: 'There was an error creating the facility.',
			});
		},
	});

	const updateFacilityMutation = useMutation({
		mutationFn: updateFacility,
		onSuccess: () => {
			queryClient.invalidateQueries(['facilities']);
			setDialogOpen(false);
			setFormData({ facilityID: '', name: '', description: '' });
			Swal.fire({
				icon: 'success',
				title: 'Facility Updated',
				text: 'The facility has been updated successfully.',
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: (error) => {
			console.error('Failed to update facility:', error);
			Swal.fire({
				icon: 'error',
				title: 'Update Failed',
				text: 'There was an error updating the facility.',
			});
		},
	});

	const deleteFacilityMutation = useMutation({
		mutationFn: (id) => deleteFacility(id),
		onSuccess: () => {
			queryClient.invalidateQueries(['facilities']);
			Swal.fire({
				icon: 'success',
				title: 'Facility Deleted',
				text: 'The facility has been deleted successfully.',
				timer: 2000,
				showConfirmButton: false,
			});
		},
		onError: () => {
			Swal.fire({
				icon: 'error',
				title: 'Deletion Failed',
				text: 'There was an error deleting the facility.',
			});
		},
	});

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.name || !formData.description) return;
		isEditMode
			? updateFacilityMutation.mutate(formData)
			: createFacilityMutation.mutate({ name: formData.name, description: formData.description });
	};

	const handleDelete = (facilityId) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				deleteFacilityMutation.mutate(facilityId);
			}
		});
	};

	const dataFacility = data || [];
	const totalPages = Math.ceil(dataFacility.length / itemsPerPage);

	const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
	const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(Number(value));
		setCurrentPage(1);
	};

	const openCreateDialog = () => {
		setIsEditMode(false);
		setFormData({ name: '', description: '' });
		setDialogOpen(true);
	};

	const openEditDialog = (facility) => {
		setIsEditMode(true);
		setFormData({
			facilityID: facility.id,
			name: facility.name,
			description: facility.description,
		});
		setDialogOpen(true);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentData = dataFacility.slice(startIndex, startIndex + itemsPerPage);

	return (
		<ManagerLayout>
			<div className='flex flex-col gap-4'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold'>Facility List</h2>
					<Button onClick={openCreateDialog}>Create Facility</Button>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>{isEditMode ? 'Edit Facility' : 'Create Facility'}</DialogTitle>
								<DialogDescription>
									{isEditMode ? 'Update facility details.' : 'Enter details for the new facility.'}
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit}>
								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='name' className='text-right'>
											Name
										</Label>
										<Input
											id='name'
											name='name'
											value={formData.name}
											onChange={handleFormChange}
											className='col-span-3'
											required
										/>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='description' className='text-right'>
											Description
										</Label>
										<Textarea
											id='description'
											name='description'
											value={formData.description}
											onChange={handleFormChange}
											className='col-span-3'
											required
										/>
									</div>
								</div>
								<DialogFooter>
									<Button type='submit' disabled={createFacilityMutation.isLoading}>
										{createFacilityMutation.isLoading ? 'Saving...' : 'Save changes'}
									</Button>
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
										<TableHead className='w-2/6'>Description</TableHead>
										<TableHead className='w-1/6'>Created At</TableHead>
										<TableHead className='w-1/6'>Updated At</TableHead>
										<TableHead className='w-1/6'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{currentData.length > 0 ? (
										currentData.map((facility) => (
											<TableRow key={facility.id}>
												<TableCell>{facility.name}</TableCell>
												<TableCell>{facility.description}</TableCell>
												<TableCell>
													{new Date(facility.createAt).toLocaleDateString()}
												</TableCell>
												<TableCell>
													{new Date(facility.updateAt).toLocaleDateString()}
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

export default Facility;
