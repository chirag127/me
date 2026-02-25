/**
 * Summary — Professional overview (real data)
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge, Stack,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { RESUME } from '@data/resume';

export default function Summary() {
  usePageMeta({
    title: 'Resume Summary',
    description: RESUME.personal.tagline,
  });

  const totalSkills = RESUME.skills.reduce(
    (s, c) => s + c.skills.length, 0
  );

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title={RESUME.personal.name}
        description={RESUME.personal.tagline}
        breadcrumb={['Work', 'Summary']}
      />

      {/* Contact */}
      <GlassCard mb="xl">
        <Group gap="lg" wrap="wrap">
          <Text size="sm">
            📍 {RESUME.personal.location}
          </Text>
          <Text size="sm">
            📧 {RESUME.personal.email}
          </Text>
          <Text size="sm">
            📱 {RESUME.personal.mobile}
          </Text>
        </Group>
      </GlassCard>

      {/* Stats */}
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
          label="Education"
          value={RESUME.education[0].degree
            .split(' ')[0]}
          icon="🎓" color="#5856D6"
        />
      </SimpleGrid>

      {/* Summary */}
      <GlassCard mb="xl">
        <Text fw={600} mb="sm"
          className="gradient-text">
          Professional Summary
        </Text>
        <Text size="sm" c="dimmed">
          {RESUME.summary}
        </Text>
      </GlassCard>

      {/* Skills */}
      <Text fw={600} mb="sm"
        className="gradient-text">
        Skills
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
            <Group gap="xs" wrap="wrap">
              {cat.skills.map((s) => (
                <Badge key={s} size="sm"
                  variant="light">
                  {s}
                </Badge>
              ))}
            </Group>
          </GlassCard>
        ))}
      </SimpleGrid>

      {/* Honors */}
      <Text fw={600} mb="sm"
        className="gradient-text">
        Honors
      </Text>
      <Stack gap="sm">
        {RESUME.honors.map((h) => (
          <GlassCard key={h.title}>
            <Group justify="space-between">
              <div>
                <Text fw={600} size="sm">
                  {h.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {h.description}
                </Text>
              </div>
              <Badge size="xs" variant="outline">
                {h.year}
              </Badge>
            </Group>
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
