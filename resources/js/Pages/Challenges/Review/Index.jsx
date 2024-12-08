// In Review/Index.jsx
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { Head, useForm } from '@inertiajs/react';
import {
    Table,
    Button,
    Modal,
    TextInput,
    Textarea,
    Group,
    Badge,
} from '@mantine/core';

export default function ReviewIndex({ attempts }) {

    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const { data, setData, post, processing } = useForm({
        is_correct: false,
        points_earned: 0,
        review_comment: ''
    });

    const handleReview = (e) => {
        e.preventDefault();
        post(route('challenges.review.update', selectedAttempt.id), {
            onSuccess: () => setSelectedAttempt(null)
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl">Review Submissions</h2>}
        >
            <Head title="Review Submissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Table>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Challenge</th>
                            <th>Submitted At</th>
                            <th>Solution</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempts.data.map(attempt => (
                            <tr key={attempt.id}>
                                <td>{attempt.user.name}</td>
                                <td>{attempt.challenge.title}</td>
                                <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                                <td>
                                    <Button
                                        variant="light"
                                        onClick={() => setSelectedAttempt(attempt)}
                                    >
                                        Review
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <Modal
                        opened={!!selectedAttempt}
                        onClose={() => setSelectedAttempt(null)}
                        title="Review Submission"
                    >
                        {selectedAttempt && (
                            <form onSubmit={handleReview} className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Submitted Solution:</h3>
                                    <pre className="mt-2 p-4 bg-gray-100 rounded">
                                        {selectedAttempt.submitted_solution}
                                    </pre>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            checked={data.is_correct}
                                            onChange={(e) => setData('is_correct', e.target.checked)}
                                        />
                                        <label>Mark as Correct</label>
                                    </div>

                                    <TextInput
                                        label="Points to Award"
                                        type="number"
                                        value={data.points_earned}
                                        onChange={(e) => setData('points_earned', e.target.value)}
                                        disabled={!data.is_correct}
                                    />

                                    <Textarea
                                        label="Review Comment"
                                        value={data.review_comment}
                                        onChange={(e) => setData('review_comment', e.target.value)}
                                    />
                                </div>

                                <Group position="right">
                                    <Button
                                        variant="subtle"
                                        onClick={() => setSelectedAttempt(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={processing}
                                        className="bg-primary"
                                    >
                                        Submit Review
                                    </Button>
                                </Group>
                            </form>
                        )}
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
