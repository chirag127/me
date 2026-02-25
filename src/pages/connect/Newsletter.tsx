/**
 * Newsletter — Email signup
 */
import { Container, TextInput, Button, Group, Text, Stack } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

export default function Newsletter() {
    usePageMeta({ title: 'Newsletter', description: 'Subscribe' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Newsletter" description="Stay updated"
                breadcrumb={['Connect', 'Newsletter']} />
            <GlassCard>
                <Stack align="center" gap="md" py="xl">
                    <Text size="xl">📬</Text>
                    <Text fw={600} size="lg">Subscribe to Updates</Text>
                    <Text size="sm" c="dimmed" ta="center" maw={400}>
                        Get notified about new projects, blog posts, and interesting discoveries. No spam, ever.
                    </Text>
                    <Group>
                        <TextInput placeholder="your@email.com" style={{ width: 260 }} />
                        <Button leftSection={<IconMail size={14} />}
                            variant="gradient" gradient={{ from: '#007AFF', to: '#5856D6' }}>
                            Subscribe
                        </Button>
                    </Group>
                </Stack>
            </GlassCard>
        </Container>
    );
}
