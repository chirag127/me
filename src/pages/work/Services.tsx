/**
 * Services — What I can do for employers/clients
 */

import {
  Container,
  SimpleGrid,
  Text,
  Stack,
  ThemeIcon,
  Group,
} from '@mantine/core';
import {
  IconApi,
  IconBrain,
  IconCloud,
  IconCode,
  IconDatabase,
  IconRocket,
} from '@tabler/icons-react';

import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import {
  RadarChartCard,
  BarChartCard,
} from '@components/charts/Charts';

const services = [
  {
    icon: <IconApi size={24} />,
    title: 'Backend Engineering',
    desc: 'Scalable REST/GraphQL APIs with FastAPI, Flask, Express. Microservices architecture.',
    tags: ['FastAPI', 'GraphQL', 'gRPC'],
    color: 'blue',
  },
  {
    icon: <IconBrain size={24} />,
    title: 'AI/ML Solutions',
    desc: 'RAG pipelines, agentic workflows, fine-tuned LLMs. End-to-end ML deployment.',
    tags: ['LangChain', 'PyTorch', 'RAG'],
    color: 'violet',
  },
  {
    icon: <IconCloud size={24} />,
    title: 'Cloud & DevOps',
    desc: 'AWS/GCP infrastructure, Docker, Kubernetes, Terraform. CI/CD pipelines.',
    tags: ['AWS', 'Docker', 'Terraform'],
    color: 'teal',
  },
  {
    icon: <IconDatabase size={24} />,
    title: 'Data Engineering',
    desc: 'Event-driven pipelines with Kafka, Spark. Database optimization and indexing.',
    tags: ['Kafka', 'Redis', 'PostgreSQL'],
    color: 'orange',
  },
  {
    icon: <IconCode size={24} />,
    title: 'Full Stack Dev',
    desc: 'React/TypeScript frontends with responsive design. End-to-end feature delivery.',
    tags: ['React', 'TypeScript', 'Mantine'],
    color: 'pink',
  },
  {
    icon: <IconRocket size={24} />,
    title: 'System Design',
    desc: 'Distributed systems, event-driven arch, scalability planning, observability.',
    tags: ['Microservices', 'DDD', 'CQRS'],
    color: 'indigo',
  },
];

/* Service demand radar */
const demandData = services.map((s) => ({
  service: s.title.split(' ')[0],
  demand: Math.floor(60 + Math.random() * 35),
}));

/* Complexity bar */
const complexityData = services.map((s) => ({
  service: s.title.split(' ')[0],
  complexity: Math.floor(50 + Math.random() * 45),
}));

export default function Services() {
  usePageMeta({
    title: 'Services',
    description: 'What I can build for you',
  });

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Services"
        description="What I can build for you"
        breadcrumb={['Work', 'Services']}
      />

      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing="md"
        mb="xl"
      >
        <RadarChartCard
          title="Service Expertise"
          subtitle="Proficiency by domain"
          data={demandData}
          dataKey="service"
          series={[
            {
              name: 'demand',
              color: 'blue.6',
              opacity: 0.2,
            },
          ]}
        />
        <BarChartCard
          title="Project Complexity"
          subtitle="Typical engagement level"
          data={complexityData}
          dataKey="service"
          series={[
            {
              name: 'complexity',
              color: 'violet.6',
            },
          ]}
        />
      </SimpleGrid>

      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing="md"
      >
        {services.map((svc, i) => (
          <GlassCard key={i} hover>
            <Group gap="sm" mb="sm">
              <ThemeIcon
                size={44}
                radius="md"
                variant="light"
                color={svc.color}
              >
                {svc.icon}
              </ThemeIcon>
              <Text fw={600}>{svc.title}</Text>
            </Group>
            <Text size="sm" c="dimmed" mb="sm">
              {svc.desc}
            </Text>
            <Group gap={6}>
              {svc.tags.map((t) => (
                <Text
                  key={t}
                  size="xs"
                  c={svc.color}
                  fw={500}
                >
                  {t}
                </Text>
              ))}
            </Group>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
