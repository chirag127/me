/**
 * About — App information
 */
import { Container, Text, Stack, Group, Badge, Anchor, Divider } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const stack = [
    { name: 'React', ver: '19' },
    { name: 'Vite', ver: '6.4' },
    { name: 'Mantine', ver: '8' },
    { name: 'TypeScript', ver: '5.7' },
    { name: 'Recharts', ver: '2' },
    { name: 'Framer Motion', ver: '11' },
    { name: 'Zustand', ver: '5' },
];

export default function About() {
    usePageMeta({ title: 'About', description: 'About this app' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="About" description="About this portfolio"
                breadcrumb={['System', 'About']} />
            <GlassCard mb="md">
                <Text fw={600} mb="sm">Chirag Singhal — Portfolio</Text>
                <Text size="sm" c="dimmed" mb="md">
                    A modern, data-driven developer portfolio built with React, TypeScript, and Mantine.
                    Featuring 67+ pages across 7 drives with interactive charts, glassmorphism UI, and
                    real-time data visualization.
                </Text>
                <Group gap="xs">
                    <Badge variant="light">v2.0.0</Badge>
                    <Badge variant="outline">MIT License</Badge>
                </Group>
            </GlassCard>
            <GlassCard mb="md">
                <Text fw={600} mb="md">Tech Stack</Text>
                <Stack gap="xs">
                    {stack.map((s) => (
                        <Group key={s.name} justify="space-between">
                            <Text size="sm">{s.name}</Text>
                            <Badge size="xs" variant="light">v{s.ver}</Badge>
                        </Group>
                    ))}
                </Stack>
            </GlassCard>
            <GlassCard>
                <Text fw={600} mb="sm">Credits</Text>
                <Text size="sm" c="dimmed">
                    Built with ❤️ by Chirag Singhal. Icons by Tabler. Charts by Recharts.
                </Text>
                <Anchor href="https://github.com/chirag127/me" target="_blank" size="sm" mt="sm">
                    Source Code →
                </Anchor>
            </GlassCard>
        </Container>
    );
}
