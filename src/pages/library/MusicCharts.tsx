/**
 * MusicCharts — Last.fm charts link (no fake)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function MusicCharts() {
  usePageMeta({ title: 'Music Charts', description: 'Listening charts' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Music Charts" description="Listening charts"
        breadcrumb={['Library', 'Music', 'Charts']} />
      <GlassCard>
        <Text fw={600} mb="md" className="gradient-text">Last.fm Charts</Text>
        <Text size="sm" c="dimmed" mb="md">
          View real listening charts, weekly reports, and scrobble history on Last.fm.
        </Text>
        <Anchor href={`https://www.last.fm/user/${IDENTITY.usernames.lastfm}/listening-report`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>View Listening Report →</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
