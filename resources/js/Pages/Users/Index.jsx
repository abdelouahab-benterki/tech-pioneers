import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Table,
    Button,
    TextInput,
    Avatar,
    Group,
    Text,
    ActionIcon,
    Menu,
    Badge,
    Paper,
    Divider,
    Progress,
} from '@mantine/core';
import {
    Search,
    UserPlus,
    MoreVertical,
    Pencil,
    Trash,
    Trophy,
    Mail,
    Users
} from 'lucide-react';

export default function Index({ users }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase();
    };

    const maxPoints = Math.max(...users.map(user => user.points));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-secondary" />
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Users
                            </h2>
                            <Text size="sm" color="dimmed">
                                Manage system users and their points
                            </Text>
                        </div>
                    </div>
                    <Button
                        component={Link}
                        href={route('users.create')}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<UserPlus className="h-4 w-4" />}
                        size="md"
                    >
                        Add User
                    </Button>
                </div>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper className="bg-white overflow-hidden shadow-sm rounded-lg p-6" radius="md">
                        {/* Search and Stats Bar */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                            <TextInput
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="h-4 w-4" />}
                                className="max-w-md"
                                styles={{
                                    input: {
                                        '&:focus': {
                                            borderColor: 'var(--primary)',
                                        },
                                    },
                                }}
                            />
                            <Group spacing="xl">
                                <div className="text-center">
                                    <Text size="xl" weight={700} className="text-secondary">
                                        {users.length}
                                    </Text>
                                    <Text size="sm" color="dimmed">Total Users</Text>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="text-center">
                                    <Text size="xl" weight={700} className="text-primary">
                                        {maxPoints}
                                    </Text>
                                    <Text size="sm" color="dimmed">Highest Points</Text>
                                </div>
                            </Group>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <Table
                                highlightOnHover
                                className="w-full"
                                verticalSpacing="md"
                            >
                                <thead>
                                <tr>
                                    <th className="!text-gray-700 text-sm uppercase tracking-wider">User</th>
                                    <th className="!text-gray-700 text-sm uppercase tracking-wider">Contact</th>
                                    <th className="!text-gray-700 text-sm uppercase tracking-wider">Progress</th>
                                    <th className="!text-gray-700 text-sm uppercase tracking-wider text-center">Status</th>
                                    <th className="!text-gray-700 text-sm uppercase tracking-wider text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4">
                                            <Group spacing="sm">
                                                <Avatar
                                                    src={user.avatar ? `/storage/${user.avatar}` : null}
                                                    radius="xl"
                                                    size="md"
                                                    color="primary"
                                                    className="border-2 border-white shadow-sm"
                                                >
                                                    {getInitials(user.name)}
                                                </Avatar>
                                                <div>
                                                    <Text size="sm" weight={600} className="text-gray-900">
                                                        {user.name}
                                                    </Text>
                                                    <Text size="xs" className="text-gray-500">
                                                        Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    </Text>
                                                </div>
                                            </Group>
                                        </td>
                                        <td className="py-4">
                                            <Group spacing={4}>
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <Text size="sm" className="text-gray-600">
                                                    {user.email}
                                                </Text>
                                            </Group>
                                        </td>
                                        <td className="py-4">
                                            <div className="w-48">
                                                <Group spacing="xs" className="mb-1">
                                                    <Trophy className="h-4 w-4 text-primary" />
                                                    <Text size="sm" weight={500}>
                                                        {user.points} points
                                                    </Text>
                                                </Group>
                                                <Progress
                                                    value={(user.points / maxPoints) * 100}
                                                    size="sm"
                                                    radius="xl"
                                                    color="primary"
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <Badge
                                                variant="dot"
                                                color={user.email_verified_at ? 'green' : 'yellow'}
                                                size="lg"
                                            >
                                                {user.email_verified_at ? 'Verified' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            <Group position="center">
                                                <Menu position="bottom-end" shadow="lg" width={200}>
                                                    <Menu.Target>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            className="hover:bg-gray-100"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            icon={<Pencil className="h-4 w-4" />}
                                                            component={Link}
                                                            href={route('users.edit', user.id)}
                                                        >
                                                            Edit User
                                                        </Menu.Item>
                                                        <Menu.Divider />
                                                        <Menu.Item
                                                            color="red"
                                                            icon={<Trash className="h-4 w-4" />}
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this user?')) {
                                                                    // Handle delete
                                                                }
                                                            }}
                                                        >
                                                            Delete User
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
