import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Search, Globe, Menu, User } from 'react-feather';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@react-hook/media-query';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import DatePicker from './DatePicker';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Button } from './components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from 'context/AuthProvider';

const Header = ({ placeholder }) => {
	const router = useRouter();
	const { dataProfile, logout } = useAuth();

	const navRef = useRef(null);
	const headerRef = useRef(null);
	const [scrolled, setScrolled] = useState(false);
	const [inputFocus, setInputFocus] = useState(false);
	const primaryLocationRef = useRef(null);
	const secondaryLocationRef = useRef(null);

	const isSmallScreen = useMediaQuery('(max-width: 576px)');

	// form data
	const [location, setLocation] = useState('');
	const [checkInDate, setCheckInDate] = useState(new Date());
	const [checkOutDate, setCheckOutDate] = useState(new Date());
	const [numberOfAdults, setNumberOfAdults] = useState(0);
	const [numberOfChildren, setNumberOfChildren] = useState(0);

	const openDatePicker = () => {
		setInputFocus(true);
		document.body.style.overflow = 'hidden';
		setTimeout(() => {
			if (!isSmallScreen && secondaryLocationRef.current) {
				secondaryLocationRef.current.focus();
			}
		}, 10);
	};

	const closeDatePicker = () => {
		setInputFocus(false);
		setLocation('');
		setNumberOfAdults(0);
		setNumberOfChildren(0);
		setCheckInDate(new Date());
		setCheckOutDate(new Date());
		document.body.style.overflow = 'intial';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!location) {
			primaryLocationRef.current.focus();
			return;
		}

		router.push({
			pathname: '/search',
			query: {
				location: location,
				checkIn: checkInDate.toISOString(),
				checkOut: checkOutDate.toISOString(),
				guests: numberOfAdults + numberOfChildren,
			},
		});
		setTimeout(() => closeDatePicker(), 100);
	};

	useEffect(() => {
		const handleClick = (e) => {
			if (!headerRef.current?.contains(e.target)) {
				closeDatePicker();
			}
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	useEffect(() => {
		const onScroll = () => {
			if (window.scrollY > 10) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<HeaderSection
			ref={headerRef}
			className={[
				scrolled || inputFocus || router.pathname !== '/' ? 'scrolled' : null,
				inputFocus ? 'inputFocus' : null,
			]}
		>
			<div className='headerInner'>
				<div className='logo' onClick={() => router.push('/')}>
					<Image src='/images/logo.jpg' width={90} height={50} alt='logo' className='rounded-full size-10' />
				</div>
				<nav ref={navRef}>
					<a href='#' className='active'>
						Places to stay
					</a>
					<a href='/home-stay'>Experiences</a>
					<a href='#'>Online Experiences</a>
				</nav>
				<form className='search'>
					<input
						type='text'
						ref={primaryLocationRef}
						placeholder={placeholder ? placeholder : 'Where are you going?'}
						onFocus={openDatePicker}
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>

					{inputFocus && (
						<div className='overlay'>
							<div className='field'>
								<label htmlFor='location'>Location</label>
								<input
									type='text'
									id='location'
									value={location}
									ref={secondaryLocationRef}
									onChange={(e) => setLocation(e.target.value)}
									placeholder='Where are you going?'
								/>
							</div>

							<div className='field'>
								<label>Check-in</label>
								<input disabled placeholder='Add dates' value={checkInDate} />
							</div>

							<div className='field'>
								<label>Check-out</label>
								<input disabled placeholder='Add dates' value={checkOutDate} />
							</div>

							<div className='field'>
								<label>Guests</label>
								<span className='guestNumber'>
									{numberOfChildren || numberOfAdults ? (
										<p>{numberOfChildren + numberOfAdults} guests</p>
									) : (
										<p className='empty'>Add guests</p>
									)}
								</span>
							</div>
						</div>
					)}
					<button
						type='submit'
						disabled={
							inputFocus &&
							!(location && checkInDate && checkOutDate && (numberOfAdults || numberOfChildren))
						}
						onClick={handleSubmit}
						aria-label='search places'
					>
						<Search />
						<span>Search</span>
					</button>
				</form>

				{inputFocus && (
					<DatePicker
						className='datepicker'
						close={closeDatePicker}
						checkInDate={{ value: checkInDate, setValue: setCheckInDate }}
						checkOutDate={{ value: checkOutDate, setValue: setCheckOutDate }}
						numberOfAdults={{
							value: numberOfAdults,
							setValue: setNumberOfAdults,
						}}
						numberOfChildren={{
							value: numberOfChildren,
							setValue: setNumberOfChildren,
						}}
					/>
				)}

				<div className='profile'>
					<ThemeToggle icon />
					{dataProfile ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className='user'>
									<Menu className='menu' />
									<User className='userIcon' />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-56'>
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										Profile
										<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout}>
									Log out
									<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link href='/auth/register'>
							<button className='px-2 py-1 bg-transparent border border-white rounded-md'>
								Login/Register
							</button>
						</Link>
					)}
				</div>
				{/* Mobile Nav */}
				<MobileNav />
			</div>
		</HeaderSection>
	);
};

export default Header;

const HeaderSection = styled.header`
	position: fixed;
	top: 0;
	color: #fafafc;
	padding: 1.5rem var(--sidePadding);
	width: 100%;
	z-index: 10;
	transition: background-color 0.2s, border-bottom 0.2s;

	.overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		background: var(--light);
		border-radius: 99px;
		display: flex;
		align-items: center;
		left: 0;
		top: 0;
		transition: all 0.2s;

		label,
		input,
		.guestNumber {
			background: none;
			font-size: 14px;
			border: none;
			line-height: 1.5;
			display: block;
			color: var(--dark);
			outline: none;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		input {
			width: 100%;
			font-weight: 700;

			&::placeholder {
				color: var(--dark);
				font-weight: 400;
				opacity: 0.5;
			}
		}

		.guestNumber {
			font-weight: 700;

			.empty {
				color: var(--dark);
				font-weight: 400;
				opacity: 0.5;
			}
		}

		.field {
			width: 100%;
			padding: 0.5rem 1.5rem;
			border-radius: 99px;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			transition: background-color 0.2s;
			position: relative;

			& + .field::before {
				position: absolute;
				content: '';
				width: 2px;
				height: 2rem;
				background: var(--gray);
				border-radius: 2px;
				left: 0;
				transition: transform 0.2s;
			}

			&:hover,
			&:focus-within {
				background: var(--gray);
			}

			&:last-of-type {
				padding-right: 10rem;
			}
		}
	}

	.overlay:hover .field::before,
	.overlay:focus-within .field::before {
		transform: scale(0);
	}

	.user,
	.profile,
	.logo,
	.globe,
	nav {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.headerInner {
		max-width: var(--containerWidth);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
	}

	& > div {
		flex: 0 0 20%;
	}

	nav {
		flex: 1;
		justify-content: center;
		transition: all 0.2s;

		a + a {
			margin-left: 1.5rem;
		}

		a {
			position: relative;
		}

		a::before {
			position: absolute;
			content: '';
			width: 1.5rem;
			height: 2px;
			border-radius: 2px;
			background: var(--light);
			bottom: -0.5rem;
			left: calc(50% - 0.75rem);
			transform: scaleX(0);
			transform-origin: center;
			transition: transform 0.2s;
		}

		a:hover::before,
		a.active::before {
			transform: scaleX(1);
		}
	}
	.logo {
		cursor: pointer;

		svg {
			height: 2rem;
			color: #fafafc;
			transition: color 0.2s;
		}

		span {
			font-weight: 600;
			font-size: 1.15rem;
			margin-left: 0.5rem;
		}
	}
	.profile {
		justify-content: flex-end;
		white-space: nowrap;
		svg {
			height: 1.15rem;
		}

		a,
		.themeToggle {
			margin-right: 1.5rem;
		}

		.userIcon {
			background: #2e2e48;
			border-radius: 99px;
			height: 1.5rem;
			width: 1.5rem;
			color: #fafafc;
		}

		.user {
			background: #fafafc;
			border-radius: 99px;
			padding: 0.25rem 0.25rem 0.25rem 0.5rem;
		}

		.menu {
			color: #2e2e48;
			margin-right: 0.5rem;
		}
	}

	form {
		position: absolute;
		transform: translate(-50%, 150%);
		left: 50%;
		top: -1rem;
		background: var(--light);
		padding: 0.5rem;
		border-radius: 99px;
		display: flex;
		align-items: center;
		max-width: 720px;
		margin: 1.5rem 0;
		width: 60vw;
		box-shadow: 0 1rem 3rem -1rem #1e1e38;
		transition: all 0.2s;
		transform-origin: center;

		& * {
			transition: all 0.2s;
		}

		& > input {
			background: none;
			border: none;
			font-size: 1.15rem;
			flex: 1;
			padding: 0 1.5rem;
			color: var(--dark);
			outline: none;

			&::placeholder {
				color: var(--dark);
				opacity: 0.6;
			}
		}

		& > button {
			background: var(--pink);
			color: #fafafc;
			border: none;
			padding: 0.5rem calc(1.75rem / 2);
			height: 3rem;
			max-width: 300px;
			display: flex;
			align-items: center;
			border-radius: 99px;
			font-weight: 700;
			font-size: 1rem;
			overflow: hidden;
			z-index: 2;

			&:hover:not(:disabled) {
				box-shadow: 0 0 0 2px var(--white), 0 0 0 4px var(--pink);
			}

			&:disabled {
				opacity: 0.5;
			}
		}

		& > button svg {
			height: 1.25rem;
			margin-right: 0.75rem;
			flex: 0 0 1.25rem;
		}
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		appearance: textfield;
	}

	@media (max-width: 576px) {
		.profile,
		.logo,
		nav,
		form > button span {
			display: none;
		}

		.overlay {
			display: none;
		}

		.headerInner {
			grid-template-columns: 1fr;
		}

		form {
			position: relative;
			transform: none !important;
			width: 100% !important;
			left: unset;
			top: 0;
			margin: 0;

			& > input {
				padding: 0 1rem;
				font-size: 1rem;
			}

			& > button {
				width: 2.5rem;
				height: 2.5rem;
				padding: 0 0.6rem;
			}

			& > button svg {
				height: 1rem;
				width: 1rem;
			}
		}
	}

	@media (min-width: 576px) and (max-width: 1000px) {
		nav {
			display: none;
		}

		.headerInner {
			grid-template-columns: 1fr 1fr;
		}
	}

	&.scrolled:not(.inputFocus) {
		background: var(--light);
		color: var(--dark);
		border-bottom: 2px solid var(--gray);

		.overlay {
			opacity: 0;
			pointer-events: none;
		}

		nav {
			opacity: 0;
			pointer-events: none;
		}

		.logo svg {
			color: var(--pink);
		}

		.user {
			box-shadow: 0 0 0 2px var(--gray);
		}

		form {
			box-shadow: 0 0 0 2px var(--gray);
			transform: translate(-50%, 0.125rem) scale(0.83);
			width: 480px;

			& > button {
				max-width: 3rem;
			}

			& > button span {
				opacity: 0;
			}
		}

		@media (max-width: 576px) {
			padding-top: 1rem;
			padding-bottom: 1rem;

			form {
				padding: 0;
				box-shadow: none;
				background: var(--gray);
			}
		}

		@media (min-width: 576px) and (max-width: 1000px) {
			.profile {
				opacity: 0;
				pointer-events: none;
			}

			form {
				left: auto;
				right: 0;
				transform: translate(0, 0.125rem) scale(0.83);
				width: 50%;
			}
		}

		@media (min-width: 1000px) and (max-width: 1296px) {
			.profile {
				a:first-child {
					opacity: 0;
				}
			}
		}
	}

	&.inputFocus {
		color: var(--dark);

		.logo svg {
			color: var(--pink);
		}

		form {
			background: var(--light);
			width: 100%;
			box-shadow: 0 1rem 1.5rem -0.5rem #0001;
		}
	}
`;
