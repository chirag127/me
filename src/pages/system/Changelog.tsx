/**
 * Changelog — Version history
 */
import { Container, Text, Timeline, ThemeIcon, Badge, Group } from '@mantine/core';
import { IconRocket } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const versions = [
    {
        ver: '2.0.0', date: 'Feb 2025', title: 'Complete Redesign',
        changes: ['67+ pages across 7 drives', 'Glassmorphism UI', 'Interactive charts', 'Dark mode']
    },
    {
        ver: '1.5.0', date: 'Jan 2025', title: 'Data Visualization',
        changes: ['Recharts integration', 'Stat cards', 'Activity graphs']
    },
    {
        ver: '1.0.0', date: 'Dec 2024', title: 'Initial Release',
        changes: ['Basic portfolio', 'Resume display', 'Project showcase']
    },
];

export default function Changelog() {
    usePageMeta({ title: 'Changelog', description: 'Version history' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Changelog" description="Version history"
                breadcrumb={['System', 'Changelog']} />
            <GlassCard>
                <Timeline active={0} bulletSize={28} lineWidth={2}>
                    {versions.map((v, i) => (
                        <Timeline.Item key={i}
                            title={<Group gap="xs">
                                <Text fw={600}>{v.title}</Text>
                                <Badge size="xs" variant="light">v{v.ver}</Badge>
                            </Group>}
                            bullet={
                                <ThemeIcon size={28} radius="xl" variant="gradient"
                                    gradient={{ from: '#007AFF', to: '#5856D6' }}>
                                    <IconRocket size={14} />
                                </ThemeIcon>
                            }>
                            <Text size="xs" c="dimmed" mb="xs">{v.date}</Text>
                            {v.changes.map((c, j) => (
                                <Text key={j} size="sm" c="dimmed">• {c}</Text>
                            ))}
                        </Timeline.Item>
                    ))}
                </Timeline>
            </GlassCard>
        </Container>
    );
}
