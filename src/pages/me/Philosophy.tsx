/**
 * Philosophy — Core values & principles
 */
import {
  Container, SimpleGrid, Text, ThemeIcon, Group,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const values = [
  {
    icon: '🎯', title: 'Build to Last',
    desc: 'Write code that survives refactors. Prefer simplicity over cleverness.'
  },
  {
    icon: '🔬', title: 'Measure Everything',
    desc: 'If it isn\'t measured, it didn\'t happen. Instrument, observe, iterate.'
  },
  {
    icon: '🤝', title: 'Collaborate First',
    desc: 'The best code is written in conversation. PRs are learning opportunities.'
  },
  {
    icon: '📚', title: 'Never Stop Learning',
    desc: 'Read papers, build prototypes, break things. Stay curious.'
  },
  {
    icon: '🛡️', title: 'Security by Default',
    desc: 'Sanitize inputs, encrypt data, rotate keys. Trust no one.'
  },
  {
    icon: '⚡', title: 'Ship Fast, Ship Right',
    desc: 'Speed matters, but not at the cost of quality. CI/CD is non-negotiable.'
  },
];

const quotes = [
  {
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci'
  },
  {
    text: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson'
  },
  {
    text: 'Any fool can write code a computer can understand. Good programmers write code humans can understand.',
    author: 'Martin Fowler'
  },
];

export default function Philosophy() {
  usePageMeta({
    title: 'Philosophy',
    description: 'Engineering values & principles',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Philosophy"
        description="How I think about engineering"
        breadcrumb={['Me', 'Philosophy']}
      />
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md" mb="xl"
      >
        {values.map((v) => (
          <GlassCard key={v.title} hover>
            <Group gap="sm" mb="sm">
              <Text size="xl">{v.icon}</Text>
              <Text fw={600}>{v.title}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              {v.desc}
            </Text>
          </GlassCard>
        ))}
      </SimpleGrid>
      <GlassCard>
        <Text fw={600} mb="md"
          className="gradient-text">
          Favorite Quotes
        </Text>
        {quotes.map((q, i) => (
          <Text key={i} size="sm"
            c="dimmed" mb="sm"
            style={{ fontStyle: 'italic' }}>
            &ldquo;{q.text}&rdquo;
            <Text span fw={500} ml="xs">
              — {q.author}
            </Text>
          </Text>
        ))}
      </GlassCard>
    </Container>
  );
}
