/**
 * RecentTracks — Last.fm recent link
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function RecentTracks() {
    usePageMeta({ title: 'Recent Tracks', description: 'Recently played' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Recent Tracks" description="Recently played"
                breadcrumb={['Library', 'Music', 'Recent']} />
            <GlassCard>
                <Text fw={600} mb="md" className="gradient-text">Recent Scrobbles</Text>
                <Text size="sm" c="dimmed" mb="md">
                    View my recently played tracks in real-time on Last.fm.
                </Text>
                <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}`}
                    target="_blank" size="sm">
                    <Group gap="xs">
                        <Text>View Recent Tracks →</Text>
                        <IconExternalLink size={14} />
                    </Group>
                </Anchor>
            </GlassCard>
        </Container>
    );
}
