/**
 * Movies — Trakt/Letterboxd profile (no fake)
 */
import {
  Container, Text, Anchor, Group,
  SimpleGrid,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const profiles = [
  {
    name: 'Trakt',
    user: IDENTITY.usernames.trakt,
    url: `https://trakt.tv/users/${IDENTITY.usernames.trakt}`,
    desc: 'Watch history and ratings',
  },
  {
    name: 'Letterboxd',
    user: IDENTITY.usernames.letterboxd,
    url: `https://letterboxd.com/${IDENTITY.usernames.letterboxd}`,
    desc: 'Film diary and reviews',
  },
];

export default function Movies() {
  usePageMeta({
    title: 'Movies',
    description: 'Film tracking',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Movies"
        description="Film tracking profiles"
        breadcrumb={['Library', 'Movies']}
      />
      <Text size="sm" c="dimmed" mb="xl">
        I track my movie watching on Trakt
        and Letterboxd. Visit my profiles
        for real-time stats and ratings.
      </Text>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        {profiles.map((p) => (
          <GlassCard key={p.name} hover>
            <Text fw={600} size="sm" mb="xs">
              {p.name}
            </Text>
            <Text size="xs" c="dimmed" mb="sm">
              {p.desc}
            </Text>
            <Anchor href={p.url}
              target="_blank" size="xs">
              <Group gap="xs">
                <Text>@{p.user}</Text>
                <IconExternalLink size={14} />
              </Group>
            </Anchor>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
