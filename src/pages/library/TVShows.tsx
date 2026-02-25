/**
 * TV Shows — Series tracking
 */
import { Container, SimpleGrid, Text, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const shows = [
  { t: 'Breaking Bad', s: 'Completed', r: '10/10' },
  { t: 'Dark', s: 'Completed', r: '9.5/10' },
  { t: 'Mr. Robot', s: 'Completed', r: '9/10' },
  { t: 'Silicon Valley', s: 'Completed', r: '8.5/10' },
  { t: 'Severance', s: 'Watching', r: '9/10' },
  { t: 'The Bear', s: 'Watching', r: '8.5/10' },
];

export default function TVShows() {
  usePageMeta({ title: 'TV Shows', description: 'Series tracking' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="TV Shows" description="Series tracking"
        breadcrumb={['Library', 'TV Shows']} />
      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="xl">
        <StatCard label="Total" value="50+" icon="📺" color="#5856D6" />
        <StatCard label="Watching" value="2" icon="▶️" color="#34C759" />
        <StatCard label="Completed" value="48+" icon="✅" color="#007AFF" />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {shows.map((s) => (
          <GlassCard key={s.t} hover>
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">{s.t}</Text>
              <Badge size="xs" variant="light"
                color={s.s === 'Watching' ? 'green' : 'blue'}>
                {s.s}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">⭐ {s.r}</Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
