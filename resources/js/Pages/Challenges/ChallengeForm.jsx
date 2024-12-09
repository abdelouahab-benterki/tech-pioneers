import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    TextInput,
    Textarea,
    NumberInput,
    Switch,
    Button,
    Paper,
    Group,
    FileInput,
    Title,
    Text,
    Image,
} from '@mantine/core';
import {
    Trophy,
    FileImage,
    Star,
    ClipboardCheck,
    Trash,
    Save,
    AlertCircle, Repeat,
} from 'lucide-react';

export default function ChallengeForm({ challenge = null }) {
    const isEditing = !!challenge;
    const [imagePreview, setImagePreview] = useState(challenge?.image ? `/storage/${challenge.image}` : null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: challenge?.title || '',
        description: challenge?.description || '',
        image: null,
        points: challenge?.points || 0,
        is_published: challenge?.is_published || false,
        requires_review: challenge?.requires_review || false,
        max_attempts: challenge?.max_attempts || 3,
    });
    console.log(data)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {

            const formData = new FormData();

            // Append all form fields
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('points', data.points);
            formData.append('is_published', data.is_published ? '1' : '0');
            formData.append('requires_review', data.requires_review ? '1' : '0');

            // Only append image if it's a new file
            if (data.image instanceof File) {
                formData.append('image', data.image);
            }

            // For debugging
            console.log('Form Data:', Object.fromEntries(formData.entries()));

            if (challenge) {
                put(route('challenges.update', challenge.id), {
                    data: formData,
                    forceFormData: true,
                    preserveScroll: true,
                });
            }
        } else {
            post(route('challenges.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleImageChange = (file) => {
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <Paper
            shadow="sm"
            radius="md"
            className="max-w-3xl mx-auto p-6 bg-white"
        >
            <div className="border-b border-gray-200 pb-4 mb-6">
                <Group position="apart">
                    <div>
                        <Title order={2} className="text-secondary flex items-center gap-2">
                            <Trophy className="h-6 w-6" />
                            {isEditing ? 'Edit Challenge' : 'Create Challenge'}
                        </Title>
                        <Text c="dimmed" size="sm">
                            {isEditing ? 'Update challenge details' : 'Create a new challenge for users to complete'}
                        </Text>
                    </div>
                </Group>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <TextInput
                    label="Challenge Title"
                    placeholder="Enter challenge title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    error={errors.title}
                    icon={<Star className="h-4 w-4" />}
                    required
                    classNames={{
                        input: 'focus:border-primary',
                    }}
                />

                <Textarea
                    label="Description"
                    placeholder="Describe the challenge and its requirements"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    error={errors.description}
                    minRows={4}
                    icon={<ClipboardCheck className="h-4 w-4" />}
                    required
                    classNames={{
                        input: 'focus:border-primary',
                    }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <FileInput
                            label="Challenge Image"
                            placeholder="Upload an image"
                            onChange={(file) => setData('image', file)}
                            error={errors.image}
                            icon={<FileImage className="h-4 w-4" />}
                            accept="image/*"
                            clearable
                            classNames={{
                                input: 'focus:border-primary',
                            }}
                        />
                        {challenge?.image && !data.image && (
                            <div className="mt-2">
                                <img
                                    src={`/storage/${challenge.image}`}
                                    alt="Current"
                                    className="h-20 w-auto rounded"
                                />
                                <Text size="sm" color="dimmed">Current image</Text>
                            </div>
                        )}
                    </div>

                    <NumberInput
                        label="Points"
                        placeholder="Enter points value"
                        value={data.points}
                        onChange={(value) => setData('points', value)}
                        error={errors.points}
                        min={0}
                        icon={<Trophy className="h-4 w-4" />}
                        required
                        classNames={{
                            input: 'focus:border-primary',
                        }}
                    />
                    <NumberInput
                        label="Maximum Attempts"
                        placeholder="Enter maximum attempts allowed"
                        value={data.max_attempts}
                        onChange={(value) => setData('max_attempts', value)}
                        error={errors.max_attempts}
                        min={1}
                        required
                        icon={<Repeat className="h-4 w-4" />}
                        classNames={{
                            input: 'focus:border-primary',
                        }}
                        description="Number of times a participant can attempt this challenge"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Switch
                        label="Publish Challenge"
                        checked={data.is_published}
                        onChange={(e) => setData('is_published', e.currentTarget.checked)}
                        color="primary"
                        size="md"
                        classNames={{
                            track: 'bg-primary',
                        }}
                    />

                    <Switch
                        label="Requires Review"
                        checked={data.requires_review}
                        onChange={(e) => setData('requires_review', e.currentTarget.checked)}
                        color="primary"
                        size="md"
                        classNames={{
                            track: 'bg-primary',
                        }}
                    />
                </div>

                <Group position="apart" className="pt-4 border-t border-gray-200">
                    <Button
                        variant="subtle"
                        color="red"
                        onClick={() => reset()}
                        disabled={processing}
                        leftIcon={<Trash className="h-4 w-4" />}
                    >
                        {isEditing ? 'Reset Changes' : 'Clear Form'}
                    </Button>

                    <Button
                        type="submit"
                        loading={processing}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<Save className="h-4 w-4" />}
                    >
                        {isEditing ? 'Update Challenge' : 'Create Challenge'}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
