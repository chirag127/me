/**
 * Repos — GitHub repository browser
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge, Anchor,
} from '@mantine/core';
import {
  IconStar, IconGitFork,
  IconExternalLink,
} from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { TagList } from '@components/ui/TagList';
import { IDENTITY } from '@data/identity';

/* Featured repos — no chart needed, card grid */
const repos = [
  {
    name: 'NexusAI-Agentic-Workflows',
    desc: 'Multi-agent RAG platform',
    lang: 'Python', stars: 12, forks: 3,
    topics: ['LangGraph', 'RAG', 'AI']
  },
  {
    name: 'TubeDigest-AI-Sponsor-Block',
    desc: 'Multimodal sponsor detection',
    lang: 'Python', stars: 8, forks: 2,
    topics: ['Transformers', 'ONNX']
  },
  {
    name: 'Olivia-Voice-Assistant',
    desc: 'Edge AI voice assistant',
    lang: 'Python', stars: 15, forks: 5,
    topics: ['Llama-3', 'Edge AI']
  },
  {
    name: 'Crawl4AI-LLM-Optimized-Web-Crawler',
    desc: 'Distributed RAG ingestion',
    lang: 'Python', stars: 6, forks: 1,
    topics: ['Redis', 'Crawling']
  },
  {
    name: 'CloudLens-Serverless-Architecture',
    desc: 'Serverless event pipeline',
    lang: 'Python', stars: 4, forks: 1,
    topics: ['AWS Lambda', 'Terraform']
  },
  {
    name: 'StreamGuard-Fraud-Detection',
    desc: 'Real-time fraud analytics',
    lang: 'Python', stars: 5, forks: 2,
    topics: ['Kafka', 'Spark']
  },
  {
    name: 'OmniPublish-Platform',
    desc: 'Content orchestration engine',
    lang: 'Python', stars: 3, forks: 0,
    topics: ['API Gateway', 'Celery']
  },
  {
    name: 'me',
    desc: 'This portfolio website',
    lang: 'TypeScript', stars: 2, forks: 0,
    topics: ['React', 'Mantine', 'Vite']
  },
];

export default function Repos() {
  usePageMeta({
    title: 'Repositories',
    description: 'GitHub repository showcase',
  });
  const gh = IDENTITY.usernames.github;
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Repositories"
        description={`github.com/${gh}`}
        breadcrumb={['Code', 'Repos']}
      />
      <SimpleGrid
        cols={{ base: 2, sm: 4 }}
        spacing="md" mb="xl"
      >
        <StatCard label="Public Repos"
          value="200+" icon="📂"
          color="#007AFF" />
        <StatCard label="Total Stars"
          value="50+" icon="⭐"
          color="#FF9500" />
        <StatCard label="Forks"
          value="30+" icon="🍴"
          color="#34C759" />
        <StatCard label="Primary Lang"
          value="Python" icon="🐍"
          color="#5856D6" />
      </SimpleGrid>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md"
      >
        {repos.map((r) => (
          <GlassCard key={r.name} hover>
            <Group justify="space-between"
              mb="xs">
              <Text fw={600} size="sm"
                lineClamp={1}>
                {r.name}
              </Text>
              <Anchor
                href={`https://github.com/${gh}/${r.name}`}
                target="_blank" size="xs">
                <IconExternalLink size={14} />
              </Anchor>
            </Group>
            <Text size="xs" c="dimmed" mb="sm">
              {r.desc}
            </Text>
            <Group gap="md" mb="sm">
              <Badge size="xs" variant="light">
                {r.lang}
              </Badge>
              <Group gap={4}>
                <IconStar size={12} />
                <Text size="xs">{r.stars}</Text>
              </Group>
              <Group gap={4}>
                <IconGitFork size={12} />
                <Text size="xs">{r.forks}</Text>
              </Group>
            </Group>
            <TagList
              tags={r.topics} size="xs"
            />
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
