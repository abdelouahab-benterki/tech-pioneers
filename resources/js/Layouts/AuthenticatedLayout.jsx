import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AppShell,
    Burger,
    Group,
    UnstyledButton,
    Avatar,
    Menu,
    rem,
    Text,
    MantineProvider,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import {Trophy, Award, Target, Users, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import FlashMessages from "@/Components/FlashMessages.jsx";
import NotificationSystem from "@/Components/NotificationSystem.jsx";

const MainLinks = ({ active }) => {
    const { auth } = usePage().props;
    const isAdmin = auth.user.roles.includes('admin');

    const links = [
        { icon: LayoutDashboard , label: 'Dashboard', route: 'dashboard' },
        { icon: Target, label: 'Challenges', route: 'challenges.index' },

    ];

    if (isAdmin) {
        links.push({
            icon: Users,
            label: 'Users',
            route: 'users.index'
        });
        links.push({
            icon: Award,
            label: 'Leaderboard',
            route: 'leaderboard'
        });
        links.push({
            icon: Trophy,
            label: 'Points',
            route: 'points.tracking'
        });
        links.push({
            icon: ClipboardCheck,
            label: 'Challenge Reviews',
            route: 'challenges.review'
        })
    }

    return (
        <div className="flex flex-col space-y-2">
            {links.map((link) => (
                <Link
                    key={link.label}
                    href={route(link.route)}
                    className={`
            flex items-center px-4 py-3 rounded-lg transition-colors duration-150
            ${route().current(link.route)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-primary/10'
                    }
          `}
                >
                    <link.icon className="w-5 h-5 mr-3" />
                    <span>{link.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default function AuthenticatedLayout({ header, children }) {
    const [opened, setOpened] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;

    const theme = {
        colors: {
            brand: [
                '#f5f0ff',
                '#e8dbff',
                '#d4bfff',
                '#b799ff',
                '#9c70ff',
                '#8f4dff',
                '#7F2BFF', // primary
                '#6a24d9',
                '#5c1ebf',
                '#4d19a6',
            ],
        },
        primaryColor: 'brand',
        primaryShade: 6,
    };

    return (
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
            <Notifications position="top-right" />
            <FlashMessages />
            <NotificationSystem />
            <AppShell
                padding="md"
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened }
                }}
                className="bg-gray-50"
            >

                <AppShell.Header className="border-b border-gray-200 bg-white">
                    <Group h="100%" px="md" justify="space-between">
                        <Group>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened(!opened)}
                                hiddenFrom="sm"
                                size="sm"
                            />
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="h-8 w-auto text-secondary" />
                            </Link>
                        </Group>

                        <Menu
                            width={200}
                            position="bottom-end"
                            transitionProps={{ transition: 'pop-top-right' }}
                        >
                            <Menu.Target>
                                <UnstyledButton className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-150">
                                    <Avatar
                                        color="primary"
                                        radius="xl"
                                        className="bg-primary text-white"
                                    >
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    <div className="hidden sm:block text-left">
                                        <Text size="sm" fw={500}>
                                            {user.name}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {user.email}
                                        </Text>
                                    </div>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    component={Link}
                                    href={route('profile.edit')}
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    component={Link}
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    color="red"
                                >
                                    Log Out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar p="md" className="bg-white">
                    <MainLinks />
                </AppShell.Navbar>

                <AppShell.Main>

                    {header && (
                        <header className="bg-white shadow mb-6 -mt-4 -mx-4">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    );
}
