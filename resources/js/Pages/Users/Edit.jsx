import { useState } from 'react';
import {router, useForm, usePage} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
    Stack,
    Switch,
    NumberInput, MultiSelect,
} from '@mantine/core';
import {
    User,
    Mail,
    Lock,
    Save,
    ImageIcon,
    Trophy,
} from 'lucide-react';

export default function EditUser({ user, availableRoles }) {
    const [imagePreview, setImagePreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
    const [changePassword, setChangePassword] = useState(false);
    const { errors } = usePage().props
    const roleOptions = availableRoles.map(role => ({
        value: role.name,
        label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
    }));


    const { data, setData, post, processing } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        avatar: null,
        points: user.points,
        roles: user.roles.map(role => role.name),
    });
    



    console.log(errors)

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('users.update', user.id), data);

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
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit User: {user.name}
                </h2>
            }
        >
            <Head title={`Edit User - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper shadow="sm" radius="md" className="max-w-2xl mx-auto p-6 bg-white">
                        <div className="border-b border-gray-200 pb-4 mb-6">
                            <Title order={2} className="text-secondary flex items-center gap-2">
                                <User className="h-6 w-6" />
                                Edit User
                            </Title>
                            <Text c="dimmed" size="sm">
                                Update user information and settings
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

                                <NumberInput
                                    label="Points"
                                    value={data.points}
                                    onChange={(value) => setData('points', value)}
                                    error={errors.points}
                                    icon={<Trophy className="h-4 w-4" />}
                                    min={0}
                                    precision={2}
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

                                <Switch
                                    label="Change Password"
                                    checked={changePassword}
                                    onChange={(e) => setChangePassword(e.currentTarget.checked)}
                                    className="mb-2"
                                />

                                {changePassword && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <PasswordInput
                                            label="New Password"
                                            placeholder="Enter new password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            error={errors.password}
                                            icon={<Lock className="h-4 w-4" />}
                                        />

                                        <PasswordInput
                                            label="Confirm Password"
                                            placeholder="Confirm new password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            error={errors.password_confirmation}
                                            icon={<Lock className="h-4 w-4" />}
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <FileInput
                                        label="Avatar"
                                        placeholder="Upload new avatar image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        icon={<ImageIcon className="h-4 w-4" />}
                                        error={errors.avatar}
                                    />

                                    {(imagePreview || user.avatar) && (
                                        <div className="mt-2">
                                            <Text size="sm" weight={500} className="mb-2">
                                                Current Avatar
                                            </Text>
                                            <Image
                                                src={imagePreview || `/storage/${user.avatar}`}
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
                                    leftIcon={<Save className="h-4 w-4" />}
                                >
                                    Save Changes
                                </Button>
                            </Group>
                        </form>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
