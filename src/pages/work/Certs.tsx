/**
 * Certifications & Honors — Real data
 */
import {
  Container, SimpleGrid, Text, Badge,
  Group,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { RESUME } from '@data/resume';

export default function Certs() {
  usePageMeta({
    title: 'Certifications & Honors',
    description: 'Awards and certifications',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Honors & Certifications"
        description="Awards and achievements"
        breadcrumb={['Work', 'Certifications']}
      />

      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard
          label="Total"
          value={String(RESUME.honors.length)}
          icon="🏆" color="#FF9500"
        />
        <StatCard
          label="Academic"
          value="2"
          icon="🎓" color="#007AFF"
        />
        <StatCard
          label="Professional"
          value="1"
          icon="📜" color="#34C759"
        />
      </SimpleGrid>

      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        {RESUME.honors.map((h) => (
          <GlassCard key={h.title} hover>
            <Group justify="space-between"
              mb="xs">
              <Text fw={600} size="sm">
                {h.title}
              </Text>
              <Badge size="xs"
                variant="outline">
                {h.year}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed"
              mb="xs">
              {h.description}
            </Text>
            <Badge size="xs" variant="light">
              {h.organization}
            </Badge>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
