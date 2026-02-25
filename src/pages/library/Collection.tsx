/**
 * Collection — Physical/digital media collection
 */
import { Container, SimpleGrid, Text, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const collection = [
  { cat: 'Blu-rays', count: 15, icon: '📀' },
  { cat: 'Vinyl Records', count: 5, icon: '💿' },
  { cat: 'Books (Physical)', count: 25, icon: '📚' },
  { cat: 'Comics/Manga', count: 10, icon: '📖' },
  { cat: 'Games', count: 30, icon: '🎮' },
  { cat: 'Posters', count: 8, icon: '🖼️' },
];

export default function Collection() {
  usePageMeta({ title: 'Collection', description: 'Media collection' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Collection" description="Physical & digital media"
        breadcrumb={['Library', 'Collection']} />
      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="xl">
        <StatCard label="Total Items" value="93" icon="📦" color="#007AFF" />
        <StatCard label="Categories" value="6" icon="📂" color="#5856D6" />
        <StatCard label="Newest" value="This week" icon="🆕" color="#34C759" />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {collection.map((c) => (
          <GlassCard key={c.cat} hover>
            <Group gap="sm">
              <Text size="xl">{c.icon}</Text>
              <div>
                <Text fw={600} size="sm">{c.cat}</Text>
                <Text size="xs" c="dimmed">{c.count} items</Text>
              </div>
            </Group>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
