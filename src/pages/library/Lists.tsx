/**
 * Lists — Curated media lists
 */
import { Container, SimpleGrid, Text, Group, Badge, Stack } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const lists = [
  { name: 'All-Time Favorites', count: 20, icon: '⭐', desc: 'Personal hall of fame' },
  { name: 'Mind-Bending Films', count: 15, icon: '🧠', desc: 'Nolan, Villeneuve, Tarkovsky' },
  { name: 'Best Soundtracks', count: 12, icon: '🎵', desc: 'Hans Zimmer and beyond' },
  { name: 'Binge-Worthy TV', count: 18, icon: '📺', desc: 'Series worth the time' },
  { name: 'Must-Read Books', count: 10, icon: '📚', desc: 'Tech and sci-fi essentials' },
  { name: 'Hidden Gems', count: 8, icon: '💎', desc: 'Underrated masterpieces' },
];

export default function Lists() {
  usePageMeta({ title: 'Lists', description: 'Curated media lists' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Lists" description="Curated media lists"
        breadcrumb={['Library', 'Lists']} />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {lists.map((l) => (
          <GlassCard key={l.name} hover>
            <Group gap="sm" mb="xs">
              <Text size="xl">{l.icon}</Text>
              <div>
                <Text fw={600} size="sm">{l.name}</Text>
                <Badge size="xs" variant="light">{l.count} items</Badge>
              </div>
            </Group>
            <Text size="xs" c="dimmed">{l.desc}</Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
