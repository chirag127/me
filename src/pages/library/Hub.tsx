/**
 * Library Hub — Media links (no fake stats)
 */
import { Container, SimpleGrid, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const platforms = [
  {
    name: 'Trakt', icon: '🎬', user: IDENTITY.usernames.trakt,
    url: `https://trakt.tv/users/${IDENTITY.usernames.trakt}`, cat: 'Movies & TV'
  },
  {
    name: 'Letterboxd', icon: '🎞️', user: IDENTITY.usernames.letterboxd,
    url: `https://letterboxd.com/${IDENTITY.usernames.letterboxd}`, cat: 'Films'
  },
  {
    name: 'Last.fm', icon: '🎵', user: IDENTITY.usernames.lastfm,
    url: `https://www.last.fm/user/${IDENTITY.usernames.lastfm}`, cat: 'Music'
  },
  {
    name: 'AniList', icon: '🎌', user: IDENTITY.usernames.anilist,
    url: `https://anilist.co/user/${IDENTITY.usernames.anilist}`, cat: 'Anime'
  },
  {
    name: 'OpenLibrary', icon: '📚', user: IDENTITY.usernames.openlibrary,
    url: `https://openlibrary.org/people/${IDENTITY.usernames.openlibrary}`, cat: 'Books'
  },
  {
    name: 'Backloggd', icon: '🎮', user: IDENTITY.usernames.backloggd,
    url: `https://backloggd.com/u/${IDENTITY.usernames.backloggd}`, cat: 'Games'
  },
];

export default function Hub() {
  usePageMeta({ title: 'Library Hub', description: 'Media profiles' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Library" description="Media consumption profiles"
        breadcrumb={['Library', 'Hub']} />
      <Text size="sm" c="dimmed" mb="xl">
        I track media consumption across dedicated platforms. Visit the profiles below for real-time stats.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {platforms.map((p) => (
          <GlassCard key={p.name} hover>
            <Group gap="sm" mb="xs">
              <Text size="xl">{p.icon}</Text>
              <div>
                <Text fw={600} size="sm">{p.name}</Text>
                <Text size="xs" c="dimmed">{p.cat}</Text>
              </div>
            </Group>
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
