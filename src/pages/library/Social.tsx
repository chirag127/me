/**
 * Social — Watch/listen activity social feed
 */
import { Container, SimpleGrid, Text, Group, Badge, Stack } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const activity = [
  { action: 'Watched', item: 'Dune: Part Two', time: '2h ago' },
  { action: 'Listened', item: 'Time — Hans Zimmer', time: '4h ago' },
  { action: 'Read', item: 'Designing Data-Intensive Apps', time: '1d ago' },
  { action: 'Watched', item: 'Severance S02E04', time: '2d ago' },
  { action: 'Listened', item: 'Comfortably Numb — Pink Floyd', time: '3d ago' },
];

export default function Social() {
  usePageMeta({ title: 'Social', description: 'Activity feed' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Social" description="Recent media activity"
        breadcrumb={['Library', 'Social']} />
      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="xl">
        <StatCard label="This Week" value="12" icon="📊" color="#007AFF" />
        <StatCard label="Streak" value="5 days" icon="🔥" color="#FF2D55" />
        <StatCard label="Friends" value="8" icon="👥" color="#34C759" />
      </SimpleGrid>
      <Stack gap="sm">
        {activity.map((a, i) => (
          <GlassCard key={i}>
            <Group justify="space-between">
              <Group gap="xs">
                <Badge size="xs" variant="light"
                  color={a.action === 'Watched' ? 'blue' : a.action === 'Listened' ? 'pink' : 'teal'}>
                  {a.action}
                </Badge>
                <Text size="sm" fw={500}>{a.item}</Text>
              </Group>
              <Text size="xs" c="dimmed">{a.time}</Text>
            </Group>
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
