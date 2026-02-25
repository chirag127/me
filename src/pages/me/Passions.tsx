/**
 * Passions — without fake charts
 */
import {
  Container, SimpleGrid, Text, Group,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const passions = [
  {
    icon: '🤖', name: 'Generative AI',
    desc: 'Building AI agents, RAG pipelines, and LLM-powered tools'
  },
  {
    icon: '🏗️', name: 'System Design',
    desc: 'Architecting scalable distributed systems and microservices'
  },
  {
    icon: '🐍', name: 'Python Ecosystem',
    desc: 'FastAPI, LangChain, data pipelines'
  },
  {
    icon: '🌐', name: 'Open Source',
    desc: 'Contributing to and maintaining open source projects'
  },
  {
    icon: '📚', name: 'Continuous Learning',
    desc: 'Staying updated with cutting-edge tech and research'
  },
  {
    icon: '🎮', name: 'Gaming & Chess',
    desc: 'Strategy games, competitive chess on Lichess'
  },
];

export default function Passions() {
  usePageMeta({
    title: 'Passions',
    description: 'What drives me',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Passions"
        description="What drives me"
        breadcrumb={['Me', 'Passions']}
      />
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md"
      >
        {passions.map((p) => (
          <GlassCard key={p.name} hover>
            <Group gap="sm" mb="xs">
              <Text size="xl">{p.icon}</Text>
              <Text fw={600} size="sm">
                {p.name}
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              {p.desc}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
