/**
 * Travel — Places visited
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';

const places = [
  {
    city: 'Delhi', country: '🇮🇳',
    year: '2020', type: 'Home'
  },
  {
    city: 'Lucknow', country: '🇮🇳',
    year: '2020-24', type: 'University'
  },
  {
    city: 'Bhubaneswar', country: '🇮🇳',
    year: '2025', type: 'Work'
  },
  {
    city: 'Ghaziabad', country: '🇮🇳',
    year: 'Childhood', type: 'Home'
  },
  {
    city: 'Manali', country: '🇮🇳',
    year: '2022', type: 'Travel'
  },
  {
    city: 'Jaipur', country: '🇮🇳',
    year: '2023', type: 'Travel'
  },
];

export default function Travel() {
  usePageMeta({
    title: 'Travel',
    description: 'Places I have been',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Travel"
        description="Places I have been"
        breadcrumb={['Me', 'Travel']}
      />
      <SimpleGrid
        cols={{ base: 2, sm: 3 }}
        spacing="md" mb="xl"
      >
        <StatCard label="Cities" value="6+"
          icon="🏙️" color="#007AFF" />
        <StatCard label="States" value="4+"
          icon="📍" color="#34C759" />
        <StatCard label="Country"
          value="India 🇮🇳" icon="🌍"
          color="#FF9500" />
      </SimpleGrid>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md"
      >
        {places.map((p) => (
          <GlassCard key={p.city} hover>
            <Group justify="space-between"
              mb="xs">
              <Group gap="xs">
                <Text size="lg">
                  {p.country}
                </Text>
                <Text fw={600}>{p.city}</Text>
              </Group>
              <Badge size="xs" variant="light">
                {p.type}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed">
              {p.year}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
