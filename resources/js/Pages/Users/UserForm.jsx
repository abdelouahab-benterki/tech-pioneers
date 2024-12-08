import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    TextInput,
    PasswordInput,
    FileInput,
    Button,
    Paper,
    Title,
    Text,
    Group,
    Image,
    Stack, MultiSelect,
} from '@mantine/core';
import { User, Mail, Lock, Upload, Image as ImageIcon } from 'lucide-react';

export default function UserForm({ user = null, availableRoles }) {
    const [imagePreview, setImagePreview] = useState(user?.avatar ? `/storage/${user.avatar}` : null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
        roles: [],  // Add roles field
    });

    // Transform roles for MultiSelect
    const roleOptions = availableRoles.map(role => ({
        value: role.name,
        label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const handleImageChange = (file) => {
        setData('avatar', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    return (
        <Paper shadow="sm" radius="md" className="max-w-2xl mx-auto p-6 bg-white">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <Title order={2} className="text-secondary flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Create New User
                </Title>
                <Text c="dimmed" size="sm">
                    Add a new user to the system
                </Text>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Stack spacing="md">
                    <TextInput
                        label="Full Name"
                        placeholder="Enter user's full name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        icon={<User className="h-4 w-4" />}
                        required
                    />

                    <TextInput
                        label="Email"
                        placeholder="user@example.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        icon={<Mail className="h-4 w-4" />}
                        required
                    />

                    <MultiSelect
                        label="Roles"
                        placeholder="Select roles"
                        data={roleOptions}
                        value={data.roles}
                        onChange={(value) => setData('roles', value)}
                        error={errors.roles}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PasswordInput
                            label="Password"
                            placeholder="Enter password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            icon={<Lock className="h-4 w-4" />}
                            required
                        />

                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Confirm password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            icon={<Lock className="h-4 w-4" />}
                            required
                        />
                    </div>



                    <div className="space-y-2">
                        <FileInput
                            label="Avatar"
                            placeholder="Upload avatar image"
                            onChange={handleImageChange}
                            accept="image/*"
                            icon={<ImageIcon className="h-4 w-4" />}
                            error={errors.avatar}
                        />

                        {imagePreview && (
                            <div className="mt-2">
                                <Image
                                    src={imagePreview}
                                    alt="Avatar preview"
                                    width={100}
                                    height={100}
                                    radius="md"
                                    className="border border-gray-200"
                                />
                            </div>
                        )}
                    </div>
                </Stack>

                <Group position="apart" className="pt-4 border-t border-gray-200">
                    <Button
                        variant="subtle"
                        color="red"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={processing}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<Upload className="h-4 w-4" />}
                    >
                        Create User
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
