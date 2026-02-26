/**
 * ShareLinks — Sharing utilities
 */
import { Container, SimpleGrid, Text, Group, CopyButton, Button } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const links = [
    { label: 'Portfolio', url: 'https://chirag127.github.io/me', icon: '🌐' },
    { label: 'GitHub', url: 'https://github.com/chirag127', icon: '🐙' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/chirag127', icon: '💼' },
    { label: 'Resume (PDF)', url: '#resume-pdf', icon: '📄' },
    { label: 'Email', url: 'mailto:hi@chirag127.in', icon: '✉️' },
];

export default function ShareLinks() {
    usePageMeta({ title: 'Share', description: 'Shareable links' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Share" description="Quick links to share"
                breadcrumb={['Connect', 'Share']} />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {links.map((l) => (
                    <GlassCard key={l.label} hover>
                        <Group justify="space-between">
                            <Group gap="sm">
                                <Text size="xl">{l.icon}</Text>
                                <div>
                                    <Text fw={600} size="sm">{l.label}</Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>{l.url}</Text>
                                </div>
                            </Group>
                            <CopyButton value={l.url}>
                                {({ copied, copy }) => (
                                    <Button size="xs" variant="light" onClick={copy}
                                        leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                        color={copied ? 'green' : 'blue'}>
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                )}
                            </CopyButton>
                        </Group>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
