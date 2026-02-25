/**
 * Anime — AniList profile (no fake lists)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Anime() {
  usePageMeta({ title: 'Anime', description: 'Anime tracking' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Anime" description="AniList tracking"
        breadcrumb={['Library', 'Anime']} />
      <GlassCard>
        <Text fw={600} mb="md" className="gradient-text">AniList</Text>
        <Text size="sm" c="dimmed" mb="md">
          I track anime watching on AniList. Visit for my anime list, scores, and stats.
        </Text>
        <Anchor href={`https://anilist.co/user/${IDENTITY.usernames.anilist}`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>anilist.co/user/{IDENTITY.usernames.anilist}</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
