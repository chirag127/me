/**
 * TopArtists — Last.fm top artists link
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function TopArtists() {
    usePageMeta({ title: 'Top Artists', description: 'Most listened artists' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Top Artists" description="Most listened"
                breadcrumb={['Library', 'Music', 'Artists']} />
            <GlassCard>
                <Text fw={600} mb="md" className="gradient-text">Last.fm Top Artists</Text>
                <Text size="sm" c="dimmed" mb="md">
                    View my most listened artists with real play counts on Last.fm.
                </Text>
                <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}/library/artists`}
                    target="_blank" size="sm">
                    <Group gap="xs">
                        <Text>View Top Artists →</Text>
                        <IconExternalLink size={14} />
                    </Group>
                </Anchor>
            </GlassCard>
        </Container>
    );
}
