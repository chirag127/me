/**
 * Profiles — All social profiles
 */
import { Container, SimpleGrid, Text, Group, Anchor, Badge } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { SOCIAL, getLinksByCategory } from '@data/social';

const categories: Array<{ cat: 'coding' | 'social' | 'media' | 'gaming' | 'professional'; label: string }> = [
    { cat: 'coding', label: 'Coding' },
    { cat: 'professional', label: 'Professional' },
    { cat: 'social', label: 'Social' },
    { cat: 'media', label: 'Media' },
    { cat: 'gaming', label: 'Gaming' },
];

export default function Profiles() {
    usePageMeta({ title: 'Profiles', description: 'All social profiles' });
    const total = Object.keys(SOCIAL).length;
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Profiles" description="All social profiles"
                breadcrumb={['Connect', 'Profiles']} />
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="xl">
                <StatCard label="Platforms" value={total} icon="🌐" color="#007AFF" />
                <StatCard label="Categories" value="5" icon="📂" color="#5856D6" />
                <StatCard label="Active" value={total} icon="✅" color="#34C759" />
            </SimpleGrid>
            {categories.map((c) => {
                const links = getLinksByCategory(c.cat);
                if (!links.length) return null;
                return (
                    <div key={c.cat}>
                        <Text fw={600} mb="sm" mt="xl" className="gradient-text">
                            {c.label}
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                            {links.map((l) => (
                                <GlassCard key={l.name} hover>
                                    <Group justify="space-between">
                                        <Group gap="xs">
                                            <Text>{l.icon}</Text>
                                            <div>
                                                <Text fw={500} size="sm">{l.name}</Text>
                                                <Text size="xs" c="dimmed">@{l.username}</Text>
                                            </div>
                                        </Group>
                                        <Anchor href={l.url} target="_blank" size="xs">
                                            <IconExternalLink size={14} />
                                        </Anchor>
                                    </Group>
                                </GlassCard>
                            ))}
                        </SimpleGrid>
                    </div>
                );
            })}
        </Container>
    );
}
