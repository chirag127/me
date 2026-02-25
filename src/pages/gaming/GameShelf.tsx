/**
 * GameShelf — Game collection
 */
import { Container, SimpleGrid, Text, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const games = [
    { t: 'Civilization VI', hours: 150, s: 'Playing' },
    { t: 'Factorio', hours: 120, s: 'Played' },
    { t: 'Celeste', hours: 45, s: 'Completed' },
    { t: 'Hollow Knight', hours: 80, s: 'Completed' },
    { t: 'Portal 2', hours: 20, s: 'Completed' },
    { t: 'Stardew Valley', hours: 60, s: 'Playing' },
    { t: 'Hades', hours: 70, s: 'Completed' },
    { t: 'Outer Wilds', hours: 35, s: 'Completed' },
];

export default function GameShelf() {
    usePageMeta({ title: 'Game Shelf', description: 'Game collection' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Game Shelf" description="My collection"
                breadcrumb={['Gaming', 'Shelf']} />
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" mb="xl">
                <StatCard label="Games" value={games.length}
                    icon="🎮" color="#007AFF" />
                <StatCard label="Total Hours" value="580"
                    icon="⏱️" color="#FF9500" />
                <StatCard label="Completed" value="5"
                    icon="✅" color="#34C759" />
                <StatCard label="Playing" value="2"
                    icon="▶️" color="#5856D6" />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                {games.map((g) => (
                    <GlassCard key={g.t} hover>
                        <Text fw={600} size="sm" mb="xs">{g.t}</Text>
                        <Group gap="xs">
                            <Badge size="xs" variant="light"
                                color={g.s === 'Playing' ? 'green' : g.s === 'Completed' ? 'blue' : 'gray'}>
                                {g.s}
                            </Badge>
                            <Text size="xs" c="dimmed">{g.hours}h</Text>
                        </Group>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
