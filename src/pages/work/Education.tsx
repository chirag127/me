/**
 * Education — Real education data from resume.ts
 */
import {
  Container, SimpleGrid, Text, Timeline,
  ThemeIcon, Badge, Group,
} from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { RESUME } from '@data/resume';

export default function Education() {
  usePageMeta({
    title: 'Education',
    description: 'Academic background',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Education"
        description="Academic background"
        breadcrumb={['Work', 'Education']}
      />

      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="CGPA"
          value="8.81"
          icon="📊" color="#007AFF"
        />
        <StatCard
          label="Rank"
          value="#1"
          icon="🏆" color="#34C759"
        />
        <StatCard
          label="JEE Advanced"
          value="AIR 11870"
          icon="🎯" color="#FF9500"
        />
      </SimpleGrid>

      <GlassCard>
        <Timeline active={0} bulletSize={28}
          lineWidth={2}>
          {RESUME.education.map((edu, i) => (
            <Timeline.Item key={i}
              title={
                <Text fw={600} size="sm">
                  {edu.degree}
                </Text>
              }
              bullet={
                <ThemeIcon size={28}
                  radius="xl"
                  variant="gradient"
                  gradient={{
                    from: '#007AFF',
                    to: '#5856D6',
                  }}>
                  <IconSchool size={14} />
                </ThemeIcon>
              }
            >
              <Text size="sm" c="dimmed">
                {edu.institution}
              </Text>
              <Text size="xs" c="dimmed"
                mb="sm">
                {edu.location} · {edu.year}
              </Text>
              {edu.details.map((d, j) => (
                <Badge key={j} size="sm"
                  variant="light" mr="xs"
                  mb="xs">
                  {d}
                </Badge>
              ))}
            </Timeline.Item>
          ))}
        </Timeline>
      </GlassCard>
    </Container>
  );
}
