/**
 * NPM — Published packages
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge, Anchor,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { IDENTITY } from '@data/identity';

const packages = [
  {
    name: 'tube-digest-cli',
    desc: 'CLI tool for YouTube sponsor detection',
    version: '1.2.0', downloads: '250/wk'
  },
  {
    name: 'crawl4ai-client',
    desc: 'Client SDK for Crawl4AI crawler',
    version: '0.8.1', downloads: '120/wk'
  },
];

export default function NPM() {
  usePageMeta({
    title: 'NPM Packages',
    description: 'Published npm packages',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="NPM Packages"
        description={`npmjs.com/~${IDENTITY.usernames.npm}`}
        breadcrumb={['Code', 'NPM']}
      />
      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard label="Packages"
          value={packages.length}
          icon="📦" color="#CC3534" />
        <StatCard label="Downloads"
          value="370/wk" icon="⬇️"
          color="#007AFF" />
        <StatCard label="Latest"
          value="v1.2.0" icon="🏷️"
          color="#34C759" />
      </SimpleGrid>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        {packages.map((p) => (
          <GlassCard key={p.name} hover>
            <Group justify="space-between"
              mb="xs">
              <Text fw={600}>{p.name}</Text>
              <Anchor
                href={`https://npmjs.com/package/${p.name}`}
                target="_blank" size="xs">
                <IconExternalLink size={14} />
              </Anchor>
            </Group>
            <Text size="sm" c="dimmed" mb="sm">
              {p.desc}
            </Text>
            <Group gap="sm">
              <Badge variant="light"
                color="red" size="sm">
                v{p.version}
              </Badge>
              <Badge variant="outline"
                size="sm">
                ⬇ {p.downloads}
              </Badge>
            </Group>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
