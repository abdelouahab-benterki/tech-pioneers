// resources/js/Pages/Leaderboard/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Table,
    Avatar,
    Badge,
    Paper,
    Title,
    Group,
    Text,
} from '@mantine/core';
import { Trophy, Target } from 'lucide-react';

export default function Leaderboard({ users }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Leaderboard
                    </h2>
                </div>
            }
        >
            <Head title="Leaderboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper className="p-6" radius="md">
                        <Table highlightOnHover>
                            <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Competitor</th>
                                <th className="text-center">Challenges Solved</th>
                                <th className="text-center">Total Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td width={100}>
                                        <Badge
                                            size="lg"
                                            className={index < 3 ? 'bg-primary' : undefined}
                                        >
                                            #{index + 1}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Group>
                                            <Avatar
                                                src={user.avatar ? `/storage/${user.avatar}` : null}
                                                color="primary"
                                                radius="xl"
                                            >
                                                {user.name.charAt(0)}
                                            </Avatar>
                                            <Text weight={500}>{user.name}</Text>
                                        </Group>
                                    </td>
                                    <td className="text-center">
                                        <Badge
                                            leftSection={<Target className="h-3 w-3" />}
                                            size="lg"
                                        >
                                            {user.challenges_solved}
                                        </Badge>
                                    </td>
                                    <td className="text-center">
                                        <Text weight={600} size="lg" className="text-primary">
                                            {user.points.toFixed(2)}
                                        </Text>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
