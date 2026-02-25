/**
 * MusicHub — Last.fm profile (no fake data)
 */
import { Container, SimpleGrid, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const profiles = [
    {
        name: 'Last.fm', user: IDENTITY.usernames.lastfm,
        url: `https://www.last.fm/user/${IDENTITY.usernames.lastfm}`,
        desc: 'Scrobble history and stats'
    },
    {
        name: 'ListenBrainz', user: IDENTITY.usernames.listenbrainz,
        url: `https://listenbrainz.org/user/${IDENTITY.usernames.listenbrainz}`,
        desc: 'Open music tracking'
    },
    {
        name: 'SoundCloud', user: IDENTITY.usernames.soundcloud,
        url: `https://soundcloud.com/${IDENTITY.usernames.soundcloud}`,
        desc: 'Mixes and playlists'
    },
];

export default function MusicHub() {
    usePageMeta({ title: 'Music', description: 'Listening activity' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Music" description="Listening profiles"
                breadcrumb={['Library', 'Music']} />
            <Text size="sm" c="dimmed" mb="xl">
                I track my listening on Last.fm and ListenBrainz. Visit my profiles for real-time stats.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                {profiles.map((p) => (
                    <GlassCard key={p.name} hover>
                        <Text fw={600} size="sm" mb="xs">{p.name}</Text>
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
