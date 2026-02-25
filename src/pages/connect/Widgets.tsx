/**
 * Widgets — Embeddable widgets & badges
 */
import { Container, SimpleGrid, Text, Code, CopyButton, Button, Group } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const widgets = [
    { name: 'GitHub Profile', code: '[![GitHub](https://img.shields.io/github/followers/chirag127?style=social)](https://github.com/chirag127)' },
    { name: 'LeetCode Badge', code: '[![LeetCode](https://img.shields.io/badge/LeetCode-chirag127-orange)](https://leetcode.com/chirag127)' },
    { name: 'Portfolio Link', code: '<a href="https://chirag127.github.io/me">chirag127.github.io/me</a>' },
    { name: 'Holopin Board', code: '[![Holopin](https://holopin.me/chirag127)](https://holopin.io/@chirag127)' },
];

export default function Widgets() {
    usePageMeta({ title: 'Widgets', description: 'Embeddable widgets' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Widgets" description="Embeddable badges & links"
                breadcrumb={['Connect', 'Widgets']} />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {widgets.map((w) => (
                    <GlassCard key={w.name}>
                        <Group justify="space-between" mb="sm">
                            <Text fw={600} size="sm">{w.name}</Text>
                            <CopyButton value={w.code}>
                                {({ copied, copy }) => (
                                    <Button size="xs" variant="light" onClick={copy}
                                        leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                                        color={copied ? 'green' : 'blue'}>
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                )}
                            </CopyButton>
                        </Group>
                        <Code block style={{ fontSize: '0.7rem' }}>{w.code}</Code>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
