/**
 * Experience — Career history (real data)
 */
import {
  Container, SimpleGrid, Text, Timeline,
  ThemeIcon, Badge, Group, List,
} from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { RESUME } from '@data/resume';

export default function Experience() {
  usePageMeta({
    title: 'Experience',
    description: 'Career history',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Experience"
        description="Career history"
        breadcrumb={['Work', 'Experience']}
      />

      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="Roles"
          value={String(RESUME.experience.length)}
          icon="💼" color="#007AFF"
        />
        <StatCard
          label="Current"
          value={RESUME.experience[0].company
            .split('(')[0].trim()
            .split(' ').slice(0, 2).join(' ')}
          icon="🏢" color="#34C759"
        />
        <StatCard
          label="Location"
          value={RESUME.experience[0].location
            .split(',')[0]}
          icon="📍" color="#FF9500"
        />
      </SimpleGrid>

      <GlassCard>
        <Timeline active={0} bulletSize={28}
          lineWidth={2}>
          {RESUME.experience.map((exp, i) => (
            <Timeline.Item key={i}
              title={
                <Group gap="xs">
                  <Text fw={600}>
                    {exp.title}
                  </Text>
                  {exp.current && (
                    <Badge size="xs"
                      variant="light"
                      color="green">
                      Current
                    </Badge>
                  )}
                </Group>
              }
              bullet={
                <ThemeIcon size={28}
                  radius="xl"
                  variant="gradient"
                  gradient={{
                    from: '#007AFF',
                    to: '#5856D6',
                  }}>
                  <IconBriefcase size={14} />
                </ThemeIcon>
              }
            >
              <Text size="sm" c="dimmed"
                mb="xs">
                {exp.company} · {exp.location}
              </Text>
              <Text size="xs" c="dimmed"
                mb="sm">
                {exp.startDate} — {exp.endDate}
              </Text>
              <List size="sm" spacing="xs">
                {exp.highlights.map((h, j) => (
                  <List.Item key={j}>
                    <Text size="xs" c="dimmed">
                      {h}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Timeline.Item>
          ))}
        </Timeline>
      </GlassCard>
    </Container>
  );
}
