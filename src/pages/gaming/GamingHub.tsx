/**
 * GamingHub — Gaming profiles (no fake data)
 */
import { Container, SimpleGrid, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const profiles = [
    {
        name: 'Lichess', icon: '♟️', user: IDENTITY.usernames.lichess,
        url: `https://lichess.org/@/${IDENTITY.usernames.lichess}`, desc: 'Chess games and ratings'
    },
    {
        name: 'Speedrun.com', icon: '⏱️', user: IDENTITY.usernames.speedrun,
        url: `https://www.speedrun.com/users/${IDENTITY.usernames.speedrun}`, desc: 'Speedrun submissions'
    },
    {
        name: 'Backloggd', icon: '🎮', user: IDENTITY.usernames.backloggd,
        url: `https://backloggd.com/u/${IDENTITY.usernames.backloggd}`, desc: 'Game collection and reviews'
    },
];

export default function GamingHub() {
    usePageMeta({ title: 'Gaming', description: 'Gaming profiles' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Gaming" description="Gaming profiles"
                breadcrumb={['Gaming', 'Hub']} />
            <Text size="sm" c="dimmed" mb="xl">
                I game casually — mostly chess, strategy, and indie titles. Visit my profiles below.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {profiles.map((p) => (
                    <GlassCard key={p.name} hover>
                        <Group gap="sm" mb="xs">
                            <Text size="xl">{p.icon}</Text>
                            <Text fw={600} size="sm">{p.name}</Text>
                        </Group>
                        <Text size="xs" c="dimmed" mb="sm">{p.desc}</Text>
                        <Anchor href={p.url} target="_blank" size="xs">
                            <Group gap="xs">
                                <Text>@{p.user}</Text>
                                <IconExternalLink size={14} />
                            </Group>
                        </Anchor>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
