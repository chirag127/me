/**
 * Concerts — Live music events
 */
import { Container, SimpleGrid, Text, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const concerts = [
    {
        artist: 'Local Band Night', venue: 'University Auditorium',
        date: '2023', type: 'Live'
    },
    {
        artist: 'College Fest', venue: 'Campus Ground',
        date: '2022', type: 'Festival'
    },
];

export default function Concerts() {
    usePageMeta({ title: 'Concerts', description: 'Live music' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Concerts" description="Live music events"
                breadcrumb={['Library', 'Music', 'Concerts']} />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {concerts.map((c) => (
                    <GlassCard key={c.artist} hover>
                        <Group justify="space-between" mb="xs">
                            <Text fw={600} size="sm">{c.artist}</Text>
                            <Badge size="xs" variant="light">{c.type}</Badge>
                        </Group>
                        <Text size="xs" c="dimmed">{c.venue} · {c.date}</Text>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
