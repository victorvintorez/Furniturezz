import {createFileRoute, redirect} from '@tanstack/react-router'
import {Anchor, Card, Center, Divider, Stack, Text, Title} from '@mantine/core'
import {useToggle} from '@mantine/hooks'
import {queryClient} from './__root.tsx'
import {getUserDetails} from '../queries/auth.ts'
import RegisterCard from '../components/auth/RegisterCard.tsx'
import LoginCard from '../components/auth/LoginCard.tsx'

const Index = () => {
	const [type, toggle] = useToggle<'login' | 'register'>(['login', 'register'])
	return (
		<Center>
			<Card withBorder radius="lg">
				<Card.Section p="lg">
					<Stack align="center" gap="xs">
						<Title order={1}>{`${type === 'login' ? "Login to" : "Register with"} Furniturezz`}</Title>
						{type === 'login' && (
							<Text size="lg">
								Or, if you don't have an account:{' '}
								<Anchor onClick={() => toggle('register')}>Register!</Anchor>
							</Text>
						)}
						{type === 'register' && (
							<Text size="lg">
								Or, if you have an account:{' '}
								<Anchor onClick={() => toggle('login')}>Login!</Anchor>
							</Text>
						)}
					</Stack>
				</Card.Section>
				<Card.Section>
					<Divider/>
				</Card.Section>
				<Card.Section>
					{type === 'login' && <LoginCard/>}
					{type === 'register' && <RegisterCard/>}
				</Card.Section>
			</Card>
		</Center>
	)
}

export const Route = createFileRoute('/auth')({
	component: Index,
	beforeLoad: async () => {
		const data = await queryClient.ensureQueryData({
			queryKey: ['auth.user'],
			queryFn: async () => await getUserDetails(),
		})
		if (data !== null) {
			throw redirect({
				to: '/',
			})
		}
	},
})
