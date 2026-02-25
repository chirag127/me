/**
 * Debug — System diagnostics (auth-gated)
 */
import { Container, Text, Stack, Code, Group, Badge } from '@mantine/core';
import { IconLock, IconBug } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { useAuth } from '@hooks/useAuth';

export default function Debug() {
    usePageMeta({ title: 'Debug', description: 'System diagnostics' });
    const { user } = useAuth();
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Debug" description="System diagnostics"
                breadcrumb={['System', 'Debug']} />
            {!user ? (
                <GlassCard>
                    <Stack align="center" gap="md" py="xl">
                        <IconLock size={48} opacity={0.3} />
                        <Text c="dimmed" ta="center">Admin access required</Text>
                    </Stack>
                </GlassCard>
            ) : (
                <>
                    <GlassCard mb="md">
                        <Group gap="xs" mb="md">
                            <IconBug size={18} />
                            <Text fw={600}>Environment</Text>
                        </Group>
                        <Code block style={{ fontSize: '0.75rem' }}>
                            {JSON.stringify({
                                node: 'v22',
                                react: '19.0',
                                vite: '6.4.1',
                                mantine: '8.0',
                                build: import.meta.env.MODE,
                                base: import.meta.env.BASE_URL,
                                user: user?.email || 'anonymous',
                            }, null, 2)}
                        </Code>
                    </GlassCard>
                    <GlassCard>
                        <Text fw={600} mb="md">Performance</Text>
                        <Code block style={{ fontSize: '0.75rem' }}>
                            {JSON.stringify({
                                routes: '67+',
                                lazyLoaded: true,
                                hashRouter: true,
                                stateManager: 'Zustand',
                                chartLib: 'Recharts',
                            }, null, 2)}
                        </Code>
                    </GlassCard>
                </>
            )}
        </Container>
    );
}
