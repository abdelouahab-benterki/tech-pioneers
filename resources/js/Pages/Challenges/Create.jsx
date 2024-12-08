import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
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
} from '@mantine/core';
import {
    Trophy,
    FileImage,
    Star,
    ClipboardCheck,
    Trash,
    Save,
} from 'lucide-react';

export default function Create() {
    const [imagePreview, setImagePreview] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        image: null,
        points: 0,
        is_published: false,
        requires_review: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('challenges.store'), {
            onSuccess: () => reset(),
        });
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
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Challenge
                </h2>
            }
        >
            <Head title="Create Challenge" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper shadow="sm" radius="md" className="max-w-3xl mx-auto p-6 bg-white">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <Group position="apart">
                                <div>
                                    <Title order={2} className="text-secondary flex items-center gap-2">
                                        <Trophy className="h-6 w-6" />
                                        Create Challenge
                                    </Title>
                                    <Text c="dimmed" size="sm">
                                        Create a new challenge for users to complete
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
                                        onChange={handleImageChange}
                                        error={errors.image}
                                        icon={<FileImage className="h-4 w-4" />}
                                        accept="image/*"
                                        clearable
                                        classNames={{
                                            input: 'focus:border-primary',
                                        }}
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-20 w-auto rounded"
                                            />
                                            <Text size="sm" color="dimmed">Image preview</Text>
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
                                    Clear Form
                                </Button>

                                <Button
                                    type="submit"
                                    loading={processing}
                                    className="bg-primary hover:bg-secondary transition-colors"
                                    leftIcon={<Save className="h-4 w-4" />}
                                >
                                    Create Challenge
                                </Button>
                            </Group>
                        </form>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
