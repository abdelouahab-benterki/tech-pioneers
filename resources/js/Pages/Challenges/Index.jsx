import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {
    Card,
    Image,
    Text,
    Badge,
    Button,
    Group,
    SimpleGrid,
    ActionIcon,
    Menu,
    Title,
    Progress
} from '@mantine/core';
import {
    Trophy,
    Clock,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Pencil,
    Trash,
    Plus,
    Search, Puzzle, Play, RotateCcw, ClipboardCheck
} from 'lucide-react';
import {Link, useForm} from '@inertiajs/react';
import {useState} from 'react';
import {router} from '@inertiajs/react'

export default function Challenges({challenges}) {
    const [searchQuery, setSearchQuery] = useState('');
    const {post} = useForm();
    const { auth } = usePage().props;

    console.log(auth);
    const isAdmin = auth.user.roles.includes('admin');
    console.log(isAdmin)


    const ChallengeCard = ({challenge}) => (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="transition-all duration-200 hover:shadow-md"
        >
            <Card.Section>
                {challenge.image ? (
                    <Image
                        src={`/storage/${challenge.image}`}
                        height={160}
                        alt={challenge.title}
                        className="object-cover"
                    />
                ) : (
                    <div
                        className="h-40 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-primary"/>
                    </div>
                )}
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500} size="lg" className="text-secondary">
                    {challenge.title}
                </Text>
                <Menu position="bottom-end">
                    <Menu.Target>
                        <ActionIcon variant="subtle">
                            <MoreVertical className="h-4 w-4"/>
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            icon={<Pencil className="h-4 w-4"/>}
                            component={Link}
                            href={route('challenges.edit', challenge.id)}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            icon={<Trash className="h-4 w-4"/>}
                            color="red"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this challenge?')) {
                                    router.delete(route('challenges.destroy', challenge.id))
                                }
                            }}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            <Text size="sm" color="dimmed" className="h-12 line-clamp-2">
                {challenge.description}
            </Text>

            <Group position="apart" mt="md">
                <Badge
                    className="bg-primary"
                    leftSection={<Trophy className="h-3 w-3"/>}
                >
                    {challenge.points} Points
                </Badge>

                <Badge
                    color={challenge.requires_review ? 'yellow' : 'green'}
                    variant="light"
                    leftIcon={challenge.requires_review ? <ClipboardCheck className="h-4 w-4"/> : <CheckCircle2 className="h-4 w-4"/>}
                >
                    {challenge.requires_review ? 'Manual Review' : 'Auto Check'}
                </Badge>

                <Badge
                    color={challenge.is_active ? 'green' : 'red'}
                    variant="light"
                    leftSection={
                        challenge.is_active ?
                            <Clock className="h-3 w-3"/> :
                            <XCircle className="h-3 w-3"/>
                    }
                >
                    {challenge.is_active ? (
                        <>
                            {challenge.time_remaining
                                ? `${Math.floor(challenge.time_remaining / 60)} mins`
                                : 'Active'
                            }
                        </>
                    ) : 'Inactive'}
                </Badge>

                <Badge
                    color={challenge.is_published ? 'green' : 'gray'}
                    variant="light"
                    leftSection={
                        challenge.is_published ?
                            <CheckCircle2 className="h-3 w-3"/> :
                            <XCircle className="h-3 w-3"/>
                    }
                >
                    {challenge.is_published ? 'Published' : 'Draft'}
                </Badge>
            </Group>

            {challenge.is_active && (
                <div className="mt-4 space-y-2">
                    {/* Add text display for time */}
                    <Text size="sm" color="gray.6" className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        Time Remaining: {challenge.time_remaining
                        ? `${Math.floor(challenge.time_remaining / 60)} mins`
                        : '00 mins'
                    }
                    </Text>

                    <Progress
                        value={challenge.time_remaining
                            ? ((challenge.duration_minutes * 60 - challenge.time_remaining) / (challenge.duration_minutes * 60)) * 100
                            : 0
                        }
                        color="green"
                        size="sm"
                        animate
                    />
                </div>
            )}

            {isAdmin && <Group position="apart" mt="md" className="border-t border-gray-200 pt-4">
                <Button
                    component={Link}
                    href={route('challenges.variants.index', challenge.id)}
                    variant="light"
                    className="text-secondary hover:bg-secondary/10"
                    leftIcon={<Puzzle className="h-4 w-4"/>}
                >
                    View Variants ({challenge.variants_count})
                </Button>

                <Group spacing="xs">
                    <Button
                        component={Link}
                        href={route('challenges.variants.create', challenge.id)}
                        variant="light"
                        className="bg-primary/10 hover:bg-primary/20 text-primary"
                        leftIcon={<Plus className="h-4 w-4"/>}
                    >
                        Add Variant
                    </Button>

                    {challenge.is_active ? (

                        <Button
                            onClick={() => post(route('challenges.deactivate', challenge.id))}
                            color="red"
                            leftIcon={<XCircle className="h-4 w-4"/>}
                        >
                            Stop
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={() => post(route('challenges.activate', challenge.id))}
                                className="bg-primary hover:bg-secondary transition-colors"
                                leftIcon={<Play className="h-4 w-4"/>}
                            >
                                Start
                            </Button>
                            <Button
                                onClick={() => {
                                    if (confirm('Are you sure you want to reset this challenge? This will remove all assignments and attempts.')) {
                                        post(route('challenges.reset', challenge.id));
                                    }
                                }}
                                variant="light"
                                color="yellow"
                                leftIcon={<RotateCcw className="h-4 w-4"/>}
                            >
                                Reset
                            </Button>
                        </>
                    )}
                </Group>
            </Group>}
            {!isAdmin && <Group justify="flex-end" position="apart" mt="md" className="border-t border-gray-200 pt-4">
                <Button
                    component={Link}
                    href={route('challenges.show', challenge.id)}
                    variant="light"
                    className="text-secondary hover:bg-secondary/10"
                    leftIcon={<Puzzle className="h-4 w-4"/>}
                >
                    Solve Challenge!
                </Button>
            </Group>}
        </Card>
    );

    const filteredChallenges = challenges.filter(challenge =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Challenges
                    </h2>
                    {isAdmin && <Button
                        component={Link}
                        href={route('challenges.create')}
                        className="bg-primary hover:bg-secondary transition-colors"
                        leftIcon={<Plus className="h-4 w-4"/>}
                    >
                        Create Challenge
                    </Button>}
                </div>
            }
        >
            <Head title="Challenges"/>

            <div className="py-6">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/>
                    </div>

                    {/* Challenges Grid */}
                    {filteredChallenges.length > 0 ? (
                        <SimpleGrid
                            cols={3}
                            spacing="lg"
                            breakpoints={[
                                {maxWidth: 'md', cols: 2, spacing: 'md'},
                                {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                            ]}
                        >
                            {filteredChallenges.map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge}/>
                            ))}
                        </SimpleGrid>
                    ) : (
                        <div className="text-center py-12">
                            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                            <Title order={3} className="text-gray-600 mb-2">
                                {isAdmin ? 'No Challenges Found': 'No Challenges Yet'}
                            </Title>
                            <Text color="dimmed">
                                {isAdmin ? "Start by creating your first challenge" : searchQuery
                                    ? "No challenges match your search criteria"
                                    : "The competition didn't start yet, warm up and get ready!"}

                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
