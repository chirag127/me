/**
 * Hobbies — Things I do for fun
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const hobbies = [
  {
    icon: '♟️', name: 'Chess',
    level: 'Intermediate',
    desc: 'Rapid & blitz on Lichess'
  },
  {
    icon: '⏱️', name: 'Speedrunning',
    level: 'Casual',
    desc: 'Platformers and retro games'
  },
  {
    icon: '📸', name: 'Photography',
    level: 'Hobbyist',
    desc: 'Street and urban photography'
  },
  {
    icon: '🎵', name: 'Music Discovery',
    level: 'Passionate',
    desc: 'Curating playlists on Last.fm'
  },
  {
    icon: '📚', name: 'Reading',
    level: 'Regular',
    desc: 'Sci-fi, tech, and biographies'
  },
  {
    icon: '🎮', name: 'Gaming',
    level: 'Regular',
    desc: 'Strategy, RPG, indie titles'
  },
  {
    icon: '✈️', name: 'Travel',
    level: 'Occasional',
    desc: 'Exploring new cities and cultures'
  },
  {
    icon: '🎌', name: 'Anime & Manga',
    level: 'Regular',
    desc: 'Tracking on AniList'
  },
];

export default function Hobbies() {
  usePageMeta({
    title: 'Hobbies',
    description: 'Things I do for fun',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Hobbies"
        description="Things I do for fun"
        breadcrumb={['Me', 'Hobbies']}
      />
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 4 }}
        spacing="md"
      >
        {hobbies.map((h) => (
          <GlassCard key={h.name} hover>
            <Group gap="sm" mb="xs">
              <Text size="xl">{h.icon}</Text>
              <div>
                <Text fw={600} size="sm">
                  {h.name}
                </Text>
                <Badge size="xs" variant="light">
                  {h.level}
                </Badge>
              </div>
            </Group>
            <Text size="xs" c="dimmed">
              {h.desc}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
