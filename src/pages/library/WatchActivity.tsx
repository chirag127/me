/**
 * WatchActivity — Trakt link (no fake data)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function WatchActivity() {
  usePageMeta({ title: 'Watch Activity', description: 'Viewing history' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Watch Activity" description="Viewing history"
        breadcrumb={['Library', 'Watch Activity']} />
      <GlassCard>
        <Text fw={600} mb="md" className="gradient-text">Trakt Activity</Text>
        <Text size="sm" c="dimmed" mb="md">
          Real-time watch history and statistics are tracked on Trakt.
        </Text>
        <Anchor href={`https://trakt.tv/users/${IDENTITY.usernames.trakt}`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>View on Trakt →</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
