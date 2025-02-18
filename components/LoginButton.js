import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginGoogle() {
	const { data: session } = useSession();
	console.log('user', session);

	if (session) {
		return (
			<>
				<p>Signed in as {session.user.email}</p>
				<p>ID Token: {session.idToken}</p>
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
