/**
 * Interests — Things I find fascinating
 */
import {
  Container, SimpleGrid, Text, Group,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const interests = [
  {
    icon: '🤖', name: 'Artificial Intelligence',
    desc: 'LLMs, agentic AI, multi-modal models, AI safety'
  },
  {
    icon: '🏗️', name: 'System Design',
    desc: 'Distributed systems, event-driven arch, scalability'
  },
  {
    icon: '🔐', name: 'Cybersecurity',
    desc: 'Reverse engineering, CTFs, network security'
  },
  {
    icon: '🚀', name: 'Space & Astronomy',
    desc: 'Astrophysics, space exploration, ISRO missions'
  },
  {
    icon: '📖', name: 'Reading',
    desc: 'Sci-fi, non-fiction, tech blogs, research papers'
  },
  {
    icon: '🎮', name: 'Gaming',
    desc: 'Strategy games, speedrunning, chess'
  },
  {
    icon: '🎵', name: 'Music',
    desc: 'Progressive rock, electronic, film scores'
  },
  {
    icon: '📸', name: 'Photography',
    desc: 'Street photography, astrophotography'
  },
  {
    icon: '🧩', name: 'Competitive Coding',
    desc: 'LeetCode, Codeforces, algorithmic puzzles'
  },
];

export default function Interests() {
  usePageMeta({
    title: 'Interests',
    description: 'Things I find fascinating',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Interests"
        description="Things I find fascinating"
        breadcrumb={['Me', 'Interests']}
      />
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md"
      >
        {interests.map((i) => (
          <GlassCard key={i.name} hover>
            <Group gap="sm" mb="xs">
              <Text size="xl">{i.icon}</Text>
              <Text fw={600}>{i.name}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {i.desc}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
