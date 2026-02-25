/**
 * Skills — Real skill data from resume.ts
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

export default function Skills() {
  usePageMeta({
    title: 'Skills',
    description: 'Technical capabilities',
  });

  const totalSkills = RESUME.skills.reduce(
    (s, c) => s + c.skills.length, 0
  );

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Skills"
        description="Technical capabilities"
        breadcrumb={['Work', 'Skills']}
      />

      <SimpleGrid
        cols={{ base: 2, sm: 4 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="Total Skills"
          value={String(totalSkills)}
          icon="🎯" color="#007AFF"
        />
        <StatCard
          label="Categories"
          value={String(RESUME.skills.length)}
          icon="📂" color="#5856D6"
        />
        <StatCard
          label="Primary"
          value="Python"
          icon="🐍" color="#34C759"
        />
        <StatCard
          label="Focus"
          value="GenAI"
          icon="🤖" color="#FF9500"
        />
      </SimpleGrid>

      <Stack gap="md">
        {RESUME.skills.map((cat) => (
          <GlassCard key={cat.category}>
            <Text fw={600} mb="md"
              className="gradient-text">
              {cat.category}
            </Text>
            <Group gap="sm" wrap="wrap">
              {cat.skills.map((s) => (
                <Badge key={s} size="lg"
                  variant="light" radius="md">
                  {s}
                </Badge>
              ))}
            </Group>
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
