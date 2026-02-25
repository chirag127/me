/**
 * TopTracks — Last.fm top tracks link
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function TopTracks() {
    usePageMeta({ title: 'Top Tracks', description: 'Most listened tracks' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Top Tracks" description="Most listened"
                breadcrumb={['Library', 'Music', 'Tracks']} />
            <GlassCard>
                <Text fw={600} mb="md" className="gradient-text">Last.fm Top Tracks</Text>
                <Text size="sm" c="dimmed" mb="md">
                    View my most listened tracks with real play counts on Last.fm.
                </Text>
                <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}/library/tracks`}
                    target="_blank" size="sm">
                    <Group gap="xs">
                        <Text>View Top Tracks →</Text>
                        <IconExternalLink size={14} />
                    </Group>
                </Anchor>
            </GlassCard>
        </Container>
    );
}
