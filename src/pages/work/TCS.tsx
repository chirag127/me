/**
 * TCS — Current role deep dive (real data)
 */
import {
  Container, Text, List, Badge, Group,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { RESUME } from '@data/resume';

const tcs = RESUME.experience[0];

export default function TCS() {
  usePageMeta({
    title: 'TCS',
    description: tcs.title,
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title={tcs.company.split('(')[0].trim()}
        description={tcs.title}
        breadcrumb={['Work', 'TCS']}
      />

      <GlassCard mb="md">
        <Group gap="lg" mb="md" wrap="wrap">
          <Badge variant="light" color="blue">
            {tcs.startDate} — {tcs.endDate}
          </Badge>
          <Badge variant="outline">
            {tcs.location}
          </Badge>
          {tcs.current && (
            <Badge variant="light" color="green">
              Current
            </Badge>
          )}
        </Group>
        <Text size="sm" c="dimmed" mb="md">
          Working as a {tcs.title} at{' '}
          {tcs.company}, contributing to
          enterprise-scale systems.
        </Text>
      </GlassCard>

      <GlassCard mb="md">
        <Text fw={600} mb="md"
          className="gradient-text">
          Key Contributions
        </Text>
        <List spacing="md" size="sm">
          {tcs.highlights.map((h, i) => (
            <List.Item key={i}>
              <Text size="sm" c="dimmed">
                {h}
              </Text>
            </List.Item>
          ))}
        </List>
      </GlassCard>

      <GlassCard>
        <Text fw={600} mb="md"
          className="gradient-text">
          Tech Used at TCS
        </Text>
        <Group gap="xs" wrap="wrap">
          {[
            'Python', 'JavaScript',
            'RESTful APIs', 'XML',
            'CI/CD', 'Agile', 'OOP',
          ].map((t) => (
            <Badge key={t} variant="light"
              size="sm">
              {t}
            </Badge>
          ))}
        </Group>
      </GlassCard>
    </Container>
  );
}
