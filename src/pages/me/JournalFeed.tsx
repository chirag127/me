/**
 * JournalFeed — Read journal entries
 */
import {
  Container, Text, Stack, Group,
  Badge, Divider,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const entries = [
  {
    date: '2025-02-25', title: 'Portfolio Redesign',
    excerpt: 'Started rebuilding my portfolio with React + Mantine. The glassmorphism looks amazing in dark mode.',
    tags: ['dev', 'design']
  },
  {
    date: '2025-02-20', title: 'First Month at TCS',
    excerpt: 'Optimized a pricing engine — 60% latency reduction. Enterprise Python is a different beast.',
    tags: ['career', 'python']
  },
  {
    date: '2025-02-15', title: 'AI Agents Are the Future',
    excerpt: 'LangGraph makes building multi-agent systems surprisingly intuitive. Working on NexusAI.',
    tags: ['ai', 'thoughts']
  },
];

export default function JournalFeed() {
  usePageMeta({
    title: 'Journal Feed',
    description: 'Recent journal entries',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal Feed"
        description="Recent entries"
        breadcrumb={['Me', 'Journal', 'Feed']}
      />
      <Stack gap="md">
        {entries.map((e, i) => (
          <GlassCard key={i} hover>
            <Group justify="space-between"
              mb="xs">
              <Text fw={600}>{e.title}</Text>
              <Text size="xs" c="dimmed">
                {e.date}
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mb="sm">
              {e.excerpt}
            </Text>
            <Group gap="xs">
              {e.tags.map((t) => (
                <Badge key={t} size="xs"
                  variant="light">
                  {t}
                </Badge>
              ))}
            </Group>
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
