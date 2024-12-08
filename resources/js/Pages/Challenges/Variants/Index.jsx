import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Table,
    Button,
    Paper,
    Title,
    Text,
    Group,
    ActionIcon,
    Menu,
    Card, Badge,
} from '@mantine/core';
import {
    Plus,
    Puzzle,
    MoreVertical,
    Pencil,
    Trash,
    Eye,
    ArrowLeft, Trophy, FileText,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ChallengeVariants({ challenge, variants }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('challenges.index')}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Challenge Variants
                            </h2>
                            <Text size="sm" color="dimmed">
                                {challenge.title}
                            </Text>
                        </div>
                    </div>

                    <Button
                        component={Link}
                        href={route('challenges.variants.create', challenge.id)}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Add Variant
                    </Button>
                </div>
            }
        >
            <Head title={`Variants - ${challenge.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm">
                        {/* Challenge Summary */}
                        <div className="p-6 border-b border-gray-200">
                            <Group position="apart">
                                <div>
                                    <Title order={3} className="text-secondary">
                                        {challenge.title}
                                    </Title>
                                    <Text color="dimmed" size="sm" className="mt-1">
                                        {challenge.description}
                                    </Text>
                                </div>
                                <Badge
                                    className="bg-primary"
                                    leftSection={<Trophy className="h-3 w-3" />}
                                >
                                    {challenge.points} Points
                                </Badge>
                            </Group>
                        </div>

                        {/* Variants Table */}
                        {variants.length > 0 ? (
                            <Table
                                className="min-w-full bg-white rounded-lg overflow-hidden"
                                horizontalSpacing="lg"
                                verticalSpacing="md"
                                striped
                                highlightOnHover
                            >
                                <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        ID
                                    </th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Solution
                                    </th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                        Created
                                    </th>
                                    <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider w-20">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {variants.map((variant, index) => (
                                    <tr
                                        key={variant.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="text-center px-6 py-4">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
            {variant.id}
          </span>
                                        </td>

                                        <td className="text-center px-6 py-4">
                                            <code className="px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm">
                                                {variant.solution}
                                            </code>
                                        </td>

                                        <td className="text-center px-6 py-4 text-sm text-gray-600">
                                            <div className="flex flex-col items-center">
            <span className="font-medium">
              {new Date(variant.created_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short'
              })}
            </span>
                                                <span className="text-xs text-gray-500">
              {new Date(variant.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
              })}
            </span>
                                            </div>
                                        </td>

                                        <td className="text-center px-6 py-4">
                                            <Group position="center" spacing={0}>
                                                <Menu position="bottom-end" shadow="md" width={200}>
                                                    <Menu.Target>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="gray"
                                                            className="hover:bg-gray-100 transition-colors"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            icon={<FileText className="h-4 w-4 text-primary" />}
                                                            component="a"
                                                            href={route('challenges.variants.download', [challenge.id, variant.id])}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            Download PDF
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            icon={<Pencil className="h-4 w-4 text-secondary" />}
                                                            component={Link}
                                                            href={route('challenges.variants.edit', [challenge.id, variant.id])}
                                                            className="hover:bg-secondary/10"
                                                        >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Divider />
                                                        <Menu.Item
                                                            icon={<Trash className="h-4 w-4" />}
                                                            color="red"
                                                            onClick={() => handleDelete(variant.id)}
                                                            className="hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <Puzzle className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                                <Title order={3} className="text-gray-600 mb-2">
                                    No Variants Yet
                                </Title>
                                <Text color="dimmed">
                                    Start by creating your first variant for this challenge
                                </Text>
                                <Button
                                    component={Link}
                                    href={route('challenges.variants.create', challenge.id)}
                                    className="bg-primary hover:bg-secondary transition-colors mt-4"
                                    leftIcon={<Plus className="h-4 w-4"/>}
                                >
                                    Create First Variant
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
