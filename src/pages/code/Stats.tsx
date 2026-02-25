/**
 * Code Stats — GitHub profile link (no fake data)
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

const gh = IDENTITY.usernames.github;

export default function Stats() {
  usePageMeta({
    title: 'Code Stats',
    description: 'GitHub overview',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Code Stats"
        description="GitHub activity overview"
        breadcrumb={['Code', 'Stats']}
      />

      <GlassCard mb="md">
        <Text fw={600} mb="md"
          className="gradient-text">
          GitHub Profile
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          View my repositories, contributions,
          and activity on GitHub.
        </Text>
        <Anchor
          href={`https://github.com/${gh}`}
          target="_blank" size="sm"
        >
          <Group gap="xs">
            <Text>github.com/{gh}</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>

      {/* GitHub readme stats embed */}
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        <GlassCard>
          <img
            src={`https://github-readme-stats.vercel.app/api?username=${gh}&show_icons=true&theme=tokyonight&hide_border=true&bg_color=00000000`}
            alt="GitHub Stats"
            style={{ width: '100%' }}
          />
        </GlassCard>
        <GlassCard>
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${gh}&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000`}
            alt="Top Languages"
            style={{ width: '100%' }}
          />
        </GlassCard>
      </SimpleGrid>

      <GlassCard mt="md">
        <img
          src={`https://github-readme-streak-stats.herokuapp.com/?user=${gh}&theme=tokyonight&hide_border=true&background=00000000`}
          alt="GitHub Streak"
          style={{ width: '100%' }}
        />
      </GlassCard>
    </Container>
  );
}
