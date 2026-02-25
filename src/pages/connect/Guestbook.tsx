/**
 * Guestbook — Visitor messages
 */
import { Container, Textarea, Button, Group, Text, Stack } from '@mantine/core';
import { IconMessagePlus } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const messages = [
    { name: 'Visitor', msg: 'Great portfolio! Love the design.', date: '2025-02-24' },
    { name: 'Developer', msg: 'Cool use of glassmorphism!', date: '2025-02-20' },
];

export default function Guestbook() {
    usePageMeta({ title: 'Guestbook', description: 'Leave a message' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Guestbook" description="Leave a message"
                breadcrumb={['Connect', 'Guestbook']} />
            <GlassCard mb="xl">
                <Textarea placeholder="Write something nice..." minRows={3} mb="sm" />
                <Group justify="flex-end">
                    <Button size="xs" leftSection={<IconMessagePlus size={14} />}
                        variant="gradient" gradient={{ from: '#007AFF', to: '#5856D6' }}>
                        Sign Guestbook
                    </Button>
                </Group>
            </GlassCard>
            <Stack gap="sm">
                {messages.map((m, i) => (
                    <GlassCard key={i}>
                        <Group justify="space-between">
                            <Text fw={500} size="sm">{m.name}</Text>
                            <Text size="xs" c="dimmed">{m.date}</Text>
                        </Group>
                        <Text size="sm" c="dimmed">{m.msg}</Text>
                    </GlassCard>
                ))}
            </Stack>
        </Container>
    );
}
