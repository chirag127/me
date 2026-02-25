/**
 * Speedrun — Speedrun.com profile (no fake data)
 */
import { Container, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Speedrun() {
  usePageMeta({ title: 'Speedruns', description: 'Speedrun profile' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Speedruns" description="Speedrun.com profile"
        breadcrumb={['Gaming', 'Speedruns']} />
      <GlassCard>
        <Text fw={600} mb="md" className="gradient-text">Speedrun.com</Text>
        <Text size="sm" c="dimmed" mb="md">
          View my speedrun submissions and personal bests on Speedrun.com.
        </Text>
        <Anchor href={`https://www.speedrun.com/users/${IDENTITY.usernames.speedrun}`}
          target="_blank" size="sm">
          <Group gap="xs">
            <Text>speedrun.com/users/{IDENTITY.usernames.speedrun}</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>
    </Container>
  );
}
