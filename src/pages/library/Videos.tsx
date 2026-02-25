/**
 * Videos — YouTube / video content
 */
import { Container, SimpleGrid, Text, Group, Badge, Anchor } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const channels = [
  { name: 'Fireship', cat: 'Dev', desc: '100s of code in 100 secs' },
  { name: 'Computerphile', cat: 'CS', desc: 'Computer science deep dives' },
  { name: '3Blue1Brown', cat: 'Math', desc: 'Visual math explanations' },
  { name: 'Theo', cat: 'Dev', desc: 'Web dev & TypeScript' },
  { name: 'ThePrimeagen', cat: 'Dev', desc: 'Performance & Vim' },
  { name: 'Kurzgesagt', cat: 'Science', desc: 'Animated science' },
];

export default function Videos() {
  usePageMeta({ title: 'Videos', description: 'Video content' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Videos" description="Channels & creators I follow"
        breadcrumb={['Library', 'Videos']} />
      <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="xl">
        <StatCard label="Subscriptions" value="50+" icon="📺" color="#FF0000" />
        <StatCard label="Watch Hours" value="200+" icon="⏱️" color="#007AFF" />
        <StatCard label="Playlists" value="10+" icon="📋" color="#34C759" />
      </SimpleGrid>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {channels.map((c) => (
          <GlassCard key={c.name} hover>
            <Group justify="space-between" mb="xs">
              <Text fw={600} size="sm">{c.name}</Text>
              <Badge size="xs" variant="light">{c.cat}</Badge>
            </Group>
            <Text size="xs" c="dimmed">{c.desc}</Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
