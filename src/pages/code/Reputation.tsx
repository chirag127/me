/**
 * Reputation — Community profiles (no fake data)
 */
import {
  Container, SimpleGrid, Text, Anchor,
  Group,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const platforms = [
  {
    name: 'Stack Overflow',
    user: IDENTITY.usernames.stackoverflow,
    url: `https://stackoverflow.com/users/${IDENTITY.usernames.stackoverflow}`,
    desc: 'Q&A contributions',
  },
  {
    name: 'Codewars',
    user: IDENTITY.usernames.codewars,
    url: `https://www.codewars.com/users/${IDENTITY.usernames.codewars}`,
    desc: 'Kata completions',
  },
  {
    name: 'Dev.to',
    user: IDENTITY.usernames.devto,
    url: `https://dev.to/${IDENTITY.usernames.devto}`,
    desc: 'Technical articles',
  },
  {
    name: 'Holopin',
    user: IDENTITY.usernames.holopin,
    url: `https://holopin.io/@${IDENTITY.usernames.holopin}`,
    desc: 'Open source badges',
  },
];

export default function Reputation() {
  usePageMeta({
    title: 'Reputation',
    description: 'Community profiles',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Reputation"
        description="Community profiles"
        breadcrumb={['Code', 'Reputation']}
      />

      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        {platforms.map((p) => (
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
