/**
 * Dashboard — Personal overview using REAL resume data
 */
import {
  Container, SimpleGrid, Text, Group,
  Stack, Anchor,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { RESUME } from '@data/resume';
import { IDENTITY } from '@data/identity';

export default function Dashboard() {
  usePageMeta({
    title: 'Dashboard',
    description: 'Personal overview',
  });

  const totalSkills = RESUME.skills.reduce(
    (sum, c) => sum + c.skills.length, 0
  );

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title={`Hi, I'm ${IDENTITY.firstName}`}
        description={IDENTITY.bio}
        breadcrumb={['Me', 'Dashboard']}
      />

      {/* Real stat cards */}
      <SimpleGrid
        cols={{ base: 2, sm: 4 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="Experience"
          value={`${RESUME.experience.length} roles`}
          icon="💼" color="#007AFF"
        />
        <StatCard
          label="Projects"
          value={String(RESUME.projects.length)}
          icon="🚀" color="#34C759"
        />
        <StatCard
          label="Skills"
          value={String(totalSkills)}
          icon="🎯" color="#FF9500"
        />
        <StatCard
          label="Honors"
          value={String(RESUME.honors.length)}
          icon="🏆" color="#5856D6"
        />
      </SimpleGrid>

      {/* Summary */}
      <GlassCard mb="xl">
        <Text fw={600} mb="sm"
          className="gradient-text">
          About
        </Text>
        <Text size="sm" c="dimmed">
          {RESUME.summary}
        </Text>
      </GlassCard>

      {/* Skills overview */}
      <Text fw={600} mb="sm"
        className="gradient-text">
        Skill Areas
      </Text>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md" mb="xl"
      >
        {RESUME.skills.map((cat) => (
          <GlassCard key={cat.category}>
            <Text fw={600} size="sm" mb="xs">
              {cat.category}
            </Text>
            <Text size="xs" c="dimmed">
              {cat.skills.join(' · ')}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>

      {/* Current role */}
      <GlassCard mb="xl">
        <Text fw={600} mb="sm"
          className="gradient-text">
          Current Role
        </Text>
        <Text fw={500} size="sm">
          {RESUME.experience[0].title}
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          {RESUME.experience[0].company}
          {' · '}
          {RESUME.experience[0].startDate}
          {' — '}
          {RESUME.experience[0].endDate}
        </Text>
      </GlassCard>

      {/* Quick links */}
      <GlassCard>
        <Text fw={600} mb="sm">
          Quick Links
        </Text>
        <Group gap="lg">
          <Anchor
            href={`https://github.com/${IDENTITY.usernames.github}`}
            target="_blank" size="sm"
          >
            GitHub →
          </Anchor>
          <Anchor
            href={`https://linkedin.com/in/${IDENTITY.usernames.linkedin}`}
            target="_blank" size="sm"
          >
            LinkedIn →
          </Anchor>
          <Anchor
            href={`mailto:${IDENTITY.email}`}
            size="sm"
          >
            Email →
          </Anchor>
        </Group>
      </GlassCard>
    </Container>
  );
}
