// resources/js/Pages/PointsTracking/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Table,
    Paper,
    Title,
    Text,
    Tooltip,
    ScrollArea,
} from '@mantine/core';
import { Trophy, Clock } from 'lucide-react';

export default function PointsTracking({ pointsMatrix, challenges }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Points Tracking
                    </h2>
                </div>
            }
        >
            <Head title="Points Tracking" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper className="p-6" radius="md">
                        <ScrollArea>
                            <Table highlightOnHover>
                                <thead>
                                <tr>
                                    <th>Competitor</th>
                                    {challenges.map(challenge => (
                                        <th key={challenge.id} className="text-center">
                                            {challenge.title}
                                        </th>
                                    ))}
                                    <th className="text-center">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pointsMatrix.map(competitor => (
                                    <tr key={competitor.id}>
                                        <td>
                                            <Text weight={500}>
                                                {competitor.name}
                                            </Text>
                                        </td>
                                        {challenges.map(challenge => {
                                            const points = competitor.challenges[challenge.id];
                                            return (
                                                <td key={challenge.id} className="text-center">
                                                    {points.points > 0 ? (
                                                        <Tooltip
                                                            label={`Submitted: ${new Date(points.submitted_at).toLocaleString()}`}
                                                        >
                                                            <Text className="text-primary font-medium">
                                                                {points.points.toFixed(2)}
                                                            </Text>
                                                        </Tooltip>
                                                    ) : (
                                                        <Text color="dimmed">-</Text>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="text-center">
                                            <Text weight={600} size="lg" className="text-primary">
                                                {competitor.total_points.toFixed(2)}
                                            </Text>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </ScrollArea>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
