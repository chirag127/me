/**
 * JournalCharts — Placeholder (no fake data)
 * Will show real analytics when journal has entries
 */
import { Container, Text, Stack } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

export default function JournalCharts() {
  usePageMeta({
    title: 'Journal Analytics',
    description: 'Writing analytics',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal Analytics"
        description="Writing analytics"
        breadcrumb={[
          'Me', 'Journal', 'Analytics',
        ]}
      />
      <GlassCard>
        <Stack align="center" gap="md" py="xl">
          <IconChartBar
            size={48} opacity={0.3}
          />
          <Text fw={600}>
            No journal entries yet
          </Text>
          <Text size="sm" c="dimmed"
            ta="center" maw={400}>
            Analytics will appear here once
            you start writing journal entries.
            Charts will show word counts,
            tag distributions, and writing
            frequency.
          </Text>
        </Stack>
      </GlassCard>
    </Container>
  );
}
