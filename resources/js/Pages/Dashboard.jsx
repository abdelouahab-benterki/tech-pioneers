import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Alert,
    Paper,
    Text,
    Button,
    Group,
    Badge,
    Progress,
    ScrollArea,
    Title,
    Divider
} from '@mantine/core';
import {
    AlertTriangle,
    ChevronRight,
    Factory,
    Shield,
    Brain,
    Target,
    Clock,
    Users,
    Zap,
    CheckCircle,
    ChartBar
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99]
        }
    }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const pulseGlow = {
    animate: {
        boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0)",
            "0 0 0 10px rgba(239, 68, 68, 0.1)",
            "0 0 0 20px rgba(239, 68, 68, 0)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
        }
    }
};

export default function Dashboard({ stats, categoryProgress, recentActivity }) {
    const actionCards = [
        {
            icon: Brain,
            title: "Analyze & Investigate",
            description: "Decode the sequence of events through technical analysis",
            color: "blue",
            category: "analysis",
            progress: categoryProgress.analysis.progress,
            total: categoryProgress.analysis.total,
            solved: categoryProgress.analysis.solved
        },
        {
            icon: Shield,
            title: "Develop Solutions",
            description: "Create innovative preventive measures",
            color: "green",
            category: "solution",
            progress: categoryProgress.solution.progress,
            total: categoryProgress.solution.total,
            solved: categoryProgress.solution.solved
        },
        {
            icon: Target,
            title: "Optimize Systems",
            description: "Implement and enhance safety protocols",
            color: "purple",
            category: "optimization",
            progress: categoryProgress.optimization.progress,
            total: categoryProgress.optimization.total,
            solved: categoryProgress.optimization.solved
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 15, -15, 0],
                                transition: { duration: 2, repeat: Infinity }
                            }}
                        >
                            <Factory className="h-8 w-8 text-primary" />
                        </motion.div>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Operation Cascade
                            </h2>
                            <Text size="sm" color="dimmed">Critical Incident Response</Text>
                        </div>
                    </div>
                    <Group spacing="xl">
                        <div className="text-center">
                            <Group spacing="xs">
                                <Clock className="h-4 w-4 text-primary" />
                                <Text size="sm" weight={500}>Investigation Time</Text>
                            </Group>
                            <Text size="lg" weight={700} className="text-primary">
                                {stats.timeElapsed || 'Not Started'}
                            </Text>
                        </div>
                        <Divider orientation="vertical" />
                        <div className="text-center">
                            <Group spacing="xs">
                                <Users className="h-4 w-4 text-primary" />
                                <Text size="sm" weight={500}>Active Investigators</Text>
                            </Group>
                            <Text size="lg" weight={700} className="text-primary">
                                {stats.activeInvestigators}
                            </Text>
                        </div>
                    </Group>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <motion.div
                    variants={stagger}
                    initial="initial"
                    animate="animate"
                    className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6"
                >
                    {/* Emergency Alert Banner */}
                    <motion.div variants={fadeInUp} className="relative">
                        <motion.div
                            variants={pulseGlow}
                            animate="animate"
                            className="absolute inset-0 rounded-lg"
                        />
                        <Alert
                            icon={<AlertTriangle className="h-6 w-6 animate-pulse" />}
                            title={
                                <Group position="apart">
                                    <Text>Critical Incident Investigation</Text>
                                    <Badge color="red" size="lg">ACTIVE</Badge>
                                </Group>
                            }
                            color="red"
                            radius="lg"
                            className="bg-red-50 border border-red-100 relative z-10"
                        >
                            <Group position="apart" align="center">
                                <Text size="sm" className="text-red-700">
                                    Challenges Solved: {stats.solvedChallenges} / {stats.totalChallenges}
                                </Text>
                                <Progress
                                    value={stats.overallProgress}
                                    size="xl"
                                    radius="xl"
                                    color="red"
                                    className="w-32"
                                    label={`${stats.overallProgress}%`}
                                />
                            </Group>
                        </Alert>
                    </motion.div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Story Column */}
                        <motion.div variants={fadeInUp} className="col-span-12 lg:col-span-8">
                            <Paper shadow="sm" p="xl" radius="lg" className="bg-white h-full">
                                <ScrollArea h={400}>
                                    <div className="prose max-w-none">
                                        <div className="flex items-center gap-4 mb-6">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                                            >
                                                <Zap className="h-8 w-8 text-primary" />
                                            </motion.div>
                                            <div>
                                                <Text size="xl" weight={700} className="text-gray-900">
                                                    Operation Cascade: Technical Investigation Unit
                                                </Text>
                                                <Text size="sm" color="dimmed">
                                                    Emergency Response Protocol #2847
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-4 border-l-4 border-primary bg-primary/5 rounded">
                                                <h3 className="text-lg font-semibold mb-2">The Incident</h3>
                                                <p className="text-gray-600">
                                                    At 3:27 AM, a cascade of system failures triggered a series of events
                                                    at Nexus Chemical Solutions. Multiple pressure vessels showed anomalous
                                                    readings, automated safety systems responded in unexpected ways, and the
                                                    facility's advanced containment protocols activated in a pattern that
                                                    puzzled veteran operators.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 mb-2">
                                                        Critical Systems Affected
                                                    </h4>
                                                    <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                                                        <li>Pressure Control Systems</li>
                                                        <li>Emergency Protocols</li>
                                                        <li>Containment Units</li>
                                                        <li>Safety Monitoring Network</li>
                                                    </ul>
                                                </div>

                                                <div className="p-4 bg-yellow-50 rounded-lg">
                                                    <h4 className="font-semibold text-yellow-900 mb-2">
                                                        Investigation Priorities
                                                    </h4>
                                                    <ul className="list-disc list-inside text-yellow-800 space-y-1 text-sm">
                                                        <li>Root Cause Analysis</li>
                                                        <li>System Vulnerability Assessment</li>
                                                        <li>Safety Protocol Evaluation</li>
                                                        <li>Preventive Measures Development</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </Paper>
                        </motion.div>

                        {/* Action Cards Column */}
                        <motion.div variants={fadeInUp} className="col-span-12 lg:col-span-4 space-y-6">
                            {actionCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Paper
                                        shadow="sm"
                                        p="lg"
                                        radius="md"
                                        className="bg-white hover:shadow-lg transition-all duration-200"
                                    >
                                        <Group position="apart" className="mb-4">
                                            <div className={`w-12 h-12 rounded-full bg-${card.color}-50
                                                flex items-center justify-center`}>
                                                <card.icon className={`h-6 w-6 text-${card.color}-500`} />
                                            </div>
                                            <Badge color={card.color} size="lg" variant="light">
                                                {card.solved} / {card.total} Completed
                                            </Badge>
                                        </Group>

                                        <Text weight={700} size="lg" className="mb-2">{card.title}</Text>
                                        <Text size="sm" color="dimmed" className="mb-4">
                                            {card.description}
                                        </Text>

                                        <Progress
                                            value={card.progress}
                                            color={card.color}
                                            size="sm"
                                            radius="xl"
                                            className="mb-4"
                                        />

                                        <Button
                                            variant="light"
                                            color={card.color}
                                            fullWidth
                                            component="a"
                                            href={route('challenges.index')}
                                            rightIcon={<ChevronRight className="h-4 w-4" />}
                                        >
                                            Continue Investigation
                                        </Button>
                                    </Paper>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Recent Activity Section */}
                        <motion.div variants={fadeInUp} className="col-span-12">
                            <Paper shadow="sm" p="xl" radius="lg" className="bg-white">
                                <Group position="apart" className="mb-6">
                                    <Group spacing="md">
                                        <ChartBar className="h-5 w-5 text-primary" />
                                        <Title order={3}>Recent Activity</Title>
                                    </Group>
                                    <Button
                                        variant="light"
                                        color="gray"
                                        component="a"
                                        href={route('challenges.index')}
                                        rightIcon={<ChevronRight className="h-4 w-4" />}
                                    >
                                        View All Challenges
                                    </Button>
                                </Group>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center justify-between p-3
                                                bg-gray-50 rounded-lg hover:bg-gray-100
                                                transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                {activity.status === 'solved' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-yellow-500" />
                                                )}
                                                <div>
                                                    <Text weight={500}>{activity.challenge_title}</Text>
                                                    <Text size="sm" color="dimmed">{activity.timestamp}</Text>
                                                </div>
                                            </div>
                                            {activity.points_earned > 0 && (
                                                <Badge color="green">+{activity.points_earned} points</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Paper>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
