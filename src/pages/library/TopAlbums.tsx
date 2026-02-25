/**
 * TopAlbums — Last.fm top albums link
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function TopAlbums() {
    usePageMeta({ title: 'Top Albums', description: 'Most listened albums' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Top Albums" description="Most listened"
                breadcrumb={['Library', 'Music', 'Albums']} />
            <GlassCard>
                <Text fw={600} mb="md" className="gradient-text">Last.fm Top Albums</Text>
                <Text size="sm" c="dimmed" mb="md">
                    View my most listened albums with real play counts on Last.fm.
                </Text>
                <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}/library/albums`}
                    target="_blank" size="sm">
                    <Group gap="xs">
                        <Text>View Top Albums →</Text>
                        <IconExternalLink size={14} />
                    </Group>
                </Anchor>
            </GlassCard>
        </Container>
    );
}
