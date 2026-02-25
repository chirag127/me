/**
 * BookNotes — Notes from reading
 */
import { Container, Text, Stack, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const notes = [
    {
        book: 'Designing Data-Intensive Apps', chapter: 'Ch5: Replication',
        note: 'Leader-based replication with sync/async followers. Failover challenges: split-brain, stale reads.', tags: ['distributed', 'databases']
    },
    {
        book: 'Clean Code', chapter: 'Ch3: Functions',
        note: 'Functions should do one thing. Extract till you drop. Side effects = lies.', tags: ['code-quality']
    },
    {
        book: 'Atomic Habits', chapter: 'Ch4: Habit Stacking',
        note: 'Link new habits to existing ones. Environment design > willpower.', tags: ['habits', 'productivity']
    },
];

export default function BookNotes() {
    usePageMeta({ title: 'Book Notes', description: 'Reading notes' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Book Notes" description="Key takeaways"
                breadcrumb={['Library', 'Books', 'Notes']} />
            <Stack gap="md">
                {notes.map((n, i) => (
                    <GlassCard key={i}>
                        <Group justify="space-between" mb="xs">
                            <Text fw={600} size="sm">{n.book}</Text>
                            <Badge size="xs" variant="outline">{n.chapter}</Badge>
                        </Group>
                        <Text size="sm" c="dimmed" mb="sm" style={{ fontStyle: 'italic' }}>
                            &ldquo;{n.note}&rdquo;
                        </Text>
                        <Group gap="xs">
                            {n.tags.map((t) => (
                                <Badge key={t} size="xs" variant="light">{t}</Badge>
                            ))}
                        </Group>
                    </GlassCard>
                ))}
            </Stack>
        </Container>
    );
}
