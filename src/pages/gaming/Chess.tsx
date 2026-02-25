/**
 * Chess — Lichess profile (no fake Elo data)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Chess() {
  usePageMeta({ title: 'Chess', description: 'Lichess profile' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Chess" description="Lichess profile"
        breadcrumb={['Gaming', 'Chess']} />
      <GlassCard mb="md">
        <Text fw={600} mb="md" className="gradient-text">Lichess</Text>
        <Text size="sm" c="dimmed" mb="md">
          I play chess on Lichess. Visit my profile for real-time ratings, game history, and stats.
        </Text>
        <Anchor href={`https://lichess.org/@/${IDENTITY.usernames.lichess}`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>lichess.org/@/{IDENTITY.usernames.lichess}</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
