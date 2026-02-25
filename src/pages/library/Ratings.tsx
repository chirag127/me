/**
 * Ratings — Profile links (no fake data)
 */
import { Container, SimpleGrid, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Ratings() {
  usePageMeta({ title: 'Ratings', description: 'My ratings across platforms' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Ratings" description="My ratings across platforms"
        breadcrumb={['Library', 'Ratings']} />
      <Text size="sm" c="dimmed" mb="xl">
        Ratings are tracked across Trakt and Letterboxd. Visit the profiles for real data.
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <GlassCard hover>
          <Text fw={600} size="sm" mb="sm">Trakt Ratings</Text>
          <Anchor href={`https://trakt.tv/users/${IDENTITY.usernames.trakt}/ratings`}
            target="_blank" size="xs">
            <Group gap="xs">
              <Text>View ratings →</Text>
              <IconExternalLink size={14} />
            </Group>
          </Anchor>
        </GlassCard>
        <GlassCard hover>
          <Text fw={600} size="sm" mb="sm">Letterboxd Ratings</Text>
          <Anchor href={`https://letterboxd.com/${IDENTITY.usernames.letterboxd}/films/ratings/`}
            target="_blank" size="xs">
            <Group gap="xs">
              <Text>View ratings →</Text>
              <IconExternalLink size={14} />
            </Group>
          </Anchor>
        </GlassCard>
      </SimpleGrid>
    </Container>
  );
}
