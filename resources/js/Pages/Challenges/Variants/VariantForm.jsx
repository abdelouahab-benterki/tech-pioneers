import { useForm } from '@inertiajs/react';
import {
    TextInput,
    Button,
    Paper,
    Group,
    Title,
    Text,
    FileInput,
} from '@mantine/core';
import { Save, ArrowLeft, FileText, Upload } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function VariantForm({ challenge, variant = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        data: null, // File object for PDF
        solution: variant?.solution || '',
        _method: variant ? 'put' : 'post', // For proper method spoofing
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (variant) {
            post(route('challenges.variants.update', [challenge.id, variant.id]), {
                forceFormData: true,
            });
        } else {
            post(route('challenges.variants.store', challenge.id), {
                forceFormData: true,
            });
        }
    };

    return (
        <Paper shadow="sm" radius="md" className="max-w-3xl mx-auto p-6 bg-white">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <Group position="apart">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('challenges.variants.index', challenge.id)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <Title order={2} className="text-secondary">
                                {variant ? 'Edit Variant' : 'Create Variant'}
                            </Title>
                            <Text size="sm" color="dimmed">
                                {challenge.title}
                            </Text>
                        </div>
                    </div>
                </Group>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <FileInput
                        label="Variant PDF"
                        placeholder="Upload PDF file"
                        accept="application/pdf"
                        icon={<Upload className="h-4 w-4" />}
                        onChange={(file) => setData('data', file)}
                        error={errors.data}
                        required={!variant}
                    />
                    {variant && !data.data && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FileText className="h-4 w-4" />
                            <span>Current file: variant_{variant.id}.pdf</span>
                        </div>
                    )}
                </div>

                <TextInput
                    label="Solution"
                    placeholder="Enter the solution"
                    value={data.solution}
                    onChange={(e) => setData('solution', e.target.value)}
                    error={errors.solution}
                    required
                />

                <Group position="apart" className="pt-4 border-t border-gray-200">
                    <Button
                        component={Link}
                        href={route('challenges.variants.index', challenge.id)}
                        variant="subtle"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={processing}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<Save className="h-4 w-4" />}
                    >
                        {variant ? 'Update Variant' : 'Create Variant'}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
