/**
 * Projects — Real project data from resume.ts
 * Tech frequency bar chart uses REAL computed data
 */
import {
  Container, SimpleGrid, Text, Badge,
  Group, Anchor, Stack,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { BarChartCard } from '@components/charts/Charts';
import { RESUME } from '@data/resume';

/* Compute tech frequency from REAL data */
const techFreq: Record<string, number> = {};
RESUME.projects.forEach((p) =>
  p.techStack.forEach((t) => {
    techFreq[t] = (techFreq[t] || 0) + 1;
  })
);
const techBarData = Object.entries(techFreq)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 8)
  .map(([tech, count]) => ({ tech, count }));

export default function Projects() {
  usePageMeta({
    title: 'Projects',
    description: 'Project portfolio',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Projects"
        description="Project portfolio"
        breadcrumb={['Work', 'Projects']}
      />

      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="Total Projects"
          value={String(RESUME.projects.length)}
          icon="🚀" color="#007AFF"
        />
        <StatCard
          label="Tech Used"
          value={String(
            Object.keys(techFreq).length
          )}
          icon="🛠️" color="#34C759"
        />
        <StatCard
          label="Most Used"
          value="Python"
          icon="🐍" color="#FF9500"
        />
      </SimpleGrid>

      {/* This chart uses REAL computed data */}
      <BarChartCard
        title="Tech Stack Frequency"
        subtitle="Across all projects"
        data={techBarData} dataKey="tech"
        series={[
          { name: 'count', color: 'blue.6' },
        ]}
      />

      <Stack gap="md" mt="xl">
        {RESUME.projects.map((p) => (
          <GlassCard key={p.name} hover>
            <Group justify="space-between"
              mb="xs">
              <Text fw={600} size="sm">
                {p.name}
              </Text>
              <Anchor
                href={`https://${p.link}`}
                target="_blank" size="xs"
              >
                <IconExternalLink size={14} />
              </Anchor>
            </Group>
            <Group gap="xs" mb="sm"
              wrap="wrap">
              {p.techStack.map((t) => (
                <Badge key={t} size="xs"
                  variant="light">
                  {t}
                </Badge>
              ))}
            </Group>
            {p.highlights.map((h, i) => (
              <Text key={i} size="xs"
                c="dimmed" mb="xs">
                • {h}
              </Text>
            ))}
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
