/**
 * Theme — Theme customization showcase
 */
import { Container, SimpleGrid, Text, ColorSwatch, Group, Stack, Paper } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const colors = [
    { name: 'Primary', hex: '#007AFF' },
    { name: 'Accent', hex: '#5856D6' },
    { name: 'Success', hex: '#34C759' },
    { name: 'Warning', hex: '#FF9500' },
    { name: 'Error', hex: '#FF2D55' },
    { name: 'Surface', hex: '#1a1b1e' },
];
const fonts = [
    { name: 'Display', font: 'Inter', weight: '700' },
    { name: 'Body', font: 'Inter', weight: '400' },
    { name: 'Code', font: 'JetBrains Mono', weight: '400' },
];

export default function Theme() {
    usePageMeta({ title: 'Theme', description: 'Design system' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Theme" description="Design system tokens"
                breadcrumb={['System', 'Theme']} />
            <GlassCard mb="md">
                <Text fw={600} mb="md">Colors</Text>
                <SimpleGrid cols={{ base: 3, sm: 6 }} spacing="md">
                    {colors.map((c) => (
                        <Stack key={c.name} align="center" gap="xs">
                            <ColorSwatch color={c.hex} size={48} />
                            <Text size="xs" fw={500}>{c.name}</Text>
                            <Text size="xs" c="dimmed">{c.hex}</Text>
                        </Stack>
                    ))}
                </SimpleGrid>
            </GlassCard>
            <GlassCard mb="md">
                <Text fw={600} mb="md">Typography</Text>
                <Stack gap="sm">
                    {fonts.map((f) => (
                        <Group key={f.name} justify="space-between">
                            <Text size="sm" style={{ fontFamily: f.font, fontWeight: Number(f.weight) }}>
                                {f.name} — {f.font}
                            </Text>
                            <Text size="xs" c="dimmed">{f.weight}</Text>
                        </Group>
                    ))}
                </Stack>
            </GlassCard>
            <GlassCard>
                <Text fw={600} mb="md">Glass Effect</Text>
                <Paper p="md" radius="md" style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}>
                    <Text size="sm" c="dimmed">
                        This card demonstrates the glassmorphism effect used throughout the app.
                    </Text>
                </Paper>
            </GlassCard>
        </Container>
    );
}
