/**
 * Manga — AniList profile (no fake lists)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Manga() {
  usePageMeta({ title: 'Manga', description: 'Manga tracking' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Manga" description="Manga reading list"
        breadcrumb={['Library', 'Manga']} />
      <GlassCard>
        <Text fw={600} mb="md" className="gradient-text">AniList Manga</Text>
        <Text size="sm" c="dimmed" mb="md">
          Manga reading is tracked on AniList alongside anime.
        </Text>
        <Anchor href={`https://anilist.co/user/${IDENTITY.usernames.anilist}/mangalist`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>View Manga List →</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
