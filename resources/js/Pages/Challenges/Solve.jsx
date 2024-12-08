import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {
    Card,
    Title,
    Text,
    Badge,
    Button,
    TextInput,
    Modal,
    Paper,
    Alert,
    Progress
} from '@mantine/core';
import { useForm } from '@inertiajs/react';
import {
    Trophy,
    FileText,
    Send,
    Clock,
    AlertCircle,
} from 'lucide-react';

import {convertUTCToLocal} from "@/Utils/utils.js";

export default function SolveChallenge({ challenge, assignment }) {
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        solution: '',
    });

    //Calculate remaining time
    useEffect(() => {
        if (challenge.is_active && challenge.ends_at) {
            const interval = setInterval(() => {
                const now = new Date();
                // Parse UTC date string to Date object
                const endTime = convertUTCToLocal(challenge.ends_at);
                const difference = endTime.getTime() - now.getTime();

                if (difference <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0);
                    window.location.reload();
                } else {
                    setTimeLeft(difference);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [challenge]);



    const formatTimeLeft = () => {
        if (!timeLeft) return '00:00';
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('challenges.submit', challenge.id), {
            onSuccess: () => {
                setSubmitModalOpen(false);
            },
        });
    };

    if (!challenge.is_active) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <Alert
                            color="yellow"
                            icon={<AlertCircle />}
                            title="Challenge Not Active"
                        >
                            This challenge hasn't been started by the administrator yet. Please wait for it to begin.
                        </Alert>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Challenge: {challenge.title}
                    </h2>
                    <div className="flex items-center gap-4">
                        <Badge
                            className="bg-secondary"
                            size="lg"
                            leftSection={<Clock className="h-4 w-4" />}
                        >
                            Time Left: {formatTimeLeft()}
                        </Badge>
                        <Badge
                            className="bg-primary"
                            size="lg"
                            leftSection={<Trophy className="h-4 w-4" />}
                        >
                            {challenge.points} Points
                        </Badge>
                    </div>
                </div>
            }
        >
            <Head title={`Solve - ${challenge.title}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card shadow="sm" padding="xl" radius="md" withBorder>
                        {/* Timer Progress Bar */}
                        <div className="mb-6">
                            <Progress
                                value={timeLeft && challenge.duration_minutes
                                    ? Math.min(100, Math.max(0, (timeLeft / (challenge.duration_minutes * 60000)) * 100))
                                    : 0
                                }
                                color={timeLeft < 60000 ? 'red' : 'blue'}
                                size="md"
                                animate
                            />
                        </div>

                        {!assignment?.submitted_at ? (
                            <>
                            <div className="mb-8">
                                <Title order={2} className="text-secondary mb-4">
                                    Instructions
                                </Title>
                                <Text className="text-gray-600 mb-6">
                                    {challenge.description}
                                </Text>

                                <Alert
                                    icon={<AlertCircle className="h-5 w-5" />}
                                    title="Time-Limited Challenge"
                                    color="blue"
                                    className="mb-6"
                                >
                                    This is a timed challenge. You have until {convertUTCToLocal(challenge.ends_at).toLocaleTimeString()} to submit your solution.
                                    The faster you solve it correctly, the more points you'll earn!
                                </Alert>
                            </div>

                            <Paper
                                withBorder
                                className="p-6 bg-gray-50 mb-6"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div>
                                        <Text size="sm" className="text-gray-500 mb-1">
                                            Your Challenge File
                                        </Text>
                                        <Text weight={500}>
                                            Variant #{assignment.challenge_variant_id}
                                        </Text>
                                    </div>
                                    <Button
                                        component="a"
                                        href={route('challenges.variants.download', [challenge.id, assignment.challenge_variant_id])}
                                        leftIcon={<FileText className="h-4 w-4" />}
                                        className="bg-secondary hover:bg-primary transition-colors"
                                        fullWidth={false}
                                    >
                                        Download PDF
                                    </Button>
                                </div>
                            </Paper>

                            <Button
                                fullWidth
                                size="lg"
                                onClick={() => setSubmitModalOpen(true)}
                                className="bg-primary hover:bg-secondary transition-colors"
                                leftIcon={<Send className="h-5 w-5" />}
                                disabled={!timeLeft}
                            >
                                {timeLeft ? 'Submit Solution' : "Time's Up!"}
                                    </Button>
                                    </>
                                    ) : (
                                    <div className="text-center py-8">
                                    <Trophy className="h-16 w-16 text-custom-green mx-auto mb-4" />
                                    <Title order={3} className="text-gray-800 mb-2">
                                Solution Submitted!
                            </Title>
                            <Text color="dimmed" className="mb-4">
                                Your solution has been recorded. Results will be available when the challenge ends.
                            </Text>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Submit Solution Modal */}
            <Modal
                opened={submitModalOpen}
                onClose={() => setSubmitModalOpen(false)}
                title="Submit Your Solution"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Alert color="blue" className="mb-4">
                        Make sure your solution is correct before submitting. You cannot change it after submission.
                    </Alert>

                    <TextInput
                        label="Your Solution"
                        placeholder="Enter your solution"
                        value={data.solution}
                        onChange={(e) => setData('solution', e.target.value)}
                        error={errors.solution}
                        required
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="subtle"
                            onClick={() => setSubmitModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={processing}
                            className="bg-primary hover:bg-secondary transition-colors"
                            leftIcon={<Send className="h-4 w-4" />}
                            disabled={!timeLeft}
                        >
                            Submit Solution
                        </Button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
);
}
