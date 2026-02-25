/**
 * Story — Personal journey narrative
 */
import {
  Container, Text, Timeline, ThemeIcon,
  Group, Badge,
} from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const milestones = [
  {
    year: '2002', title: 'Born',
    desc: 'Ghaziabad, Uttar Pradesh, India'
  },
  {
    year: '2018', title: 'First Code',
    desc: 'Started learning C++ in high school'
  },
  {
    year: '2020', title: 'JEE Advanced',
    desc: 'AIR 11870 — Top 1% nationally'
  },
  {
    year: '2020', title: 'B.Tech CSE',
    desc: 'Enrolled at AKTU, Lucknow'
  },
  {
    year: '2022', title: 'Open Source',
    desc: 'First meaningful GitHub contributions'
  },
  {
    year: '2023', title: 'QRsay.com',
    desc: 'Full Stack Developer — food e-commerce'
  },
  {
    year: '2024', title: 'College Topper',
    desc: 'Rank 1 in CS batch (CGPA 8.81)'
  },
  {
    year: '2025', title: 'TCS',
    desc: 'Software Engineer — enterprise systems'
  },
  {
    year: '2025', title: 'Oriz Platform',
    desc: '1000+ free tools on oriz.in — full-stack'
  },
  {
    year: '2025', title: 'AWS Certified',
    desc: 'AWS Certified Developer - Associate'
  },
];

export default function Story() {
  usePageMeta({
    title: 'My Story',
    description: 'Personal journey & milestones',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="My Story"
        description="The journey so far"
        breadcrumb={['Me', 'Story']}
      />
      <GlassCard mb="xl">
        <Text size="sm" c="dimmed">
          I&apos;m a software engineer who fell
          in love with building things that work
          at scale. From competitive programming
          to enterprise backends, from AI agents
          to serverless pipelines — every project
          taught me something new. Here&apos;s how
          it all happened.
        </Text>
      </GlassCard>
      <Timeline active={milestones.length - 1}
        bulletSize={28} lineWidth={2}>
        {milestones.map((m, i) => (
          <Timeline.Item key={i}
            title={
              <Group gap="xs">
                <Text fw={600}>{m.title}</Text>
                <Badge size="xs" variant="light">
                  {m.year}
                </Badge>
              </Group>
            }
            bullet={
              <ThemeIcon size={28} radius="xl"
                variant="gradient"
                gradient={{
                  from: '#007AFF',
                  to: '#5856D6',
                }}>
                <IconHeart size={14} />
              </ThemeIcon>
            }>
            <Text c="dimmed" size="sm">
              {m.desc}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Container>
  );
}
