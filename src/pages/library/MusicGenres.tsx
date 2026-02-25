/**
 * MusicGenres — Last.fm tags link
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function MusicGenres() {
    usePageMeta({ title: 'Genres', description: 'Music genres' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Genres" description="Music genre breakdown"
                breadcrumb={['Library', 'Music', 'Genres']} />
            <GlassCard>
                <Text fw={600} mb="md" className="gradient-text">Genre Tags</Text>
                <Text size="sm" c="dimmed" mb="md">
                    Genre breakdown and tag clouds are available on Last.fm.
                </Text>
                <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}/tags`}
                    target="_blank" size="sm">
                    <Group gap="xs">
                        <Text>View Tags on Last.fm →</Text>
                        <IconExternalLink size={14} />
                    </Group>
                </Anchor>
            </GlassCard>
        </Container>
    );
}
