/**
 * Browse History — Public browsing interests
 */
import { Container, Text, Stack, Group, Badge } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const sites = [
  { name: 'Hacker News', cat: 'Tech', freq: 'Daily' },
  { name: 'Reddit r/programming', cat: 'Tech', freq: 'Daily' },
  { name: 'GitHub Trending', cat: 'Code', freq: 'Daily' },
  { name: 'ArXiv cs.AI', cat: 'Research', freq: 'Weekly' },
  { name: 'LWN.net', cat: 'Linux', freq: 'Weekly' },
  { name: 'The Verge', cat: 'News', freq: 'Daily' },
  { name: 'Lobsters', cat: 'Tech', freq: 'Weekly' },
];

export default function BrowseHistory() {
  usePageMeta({ title: 'Browse', description: 'Browsing interests' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Browse" description="Sites I frequent"
        breadcrumb={['Library', 'Browse']} />
      <Stack gap="sm">
        {sites.map((s) => (
          <GlassCard key={s.name}>
            <Group justify="space-between">
              <Text fw={500} size="sm">{s.name}</Text>
              <Group gap="xs">
                <Badge size="xs" variant="light">{s.cat}</Badge>
                <Badge size="xs" variant="outline">{s.freq}</Badge>
              </Group>
            </Group>
          </GlassCard>
        ))}
      </Stack>
    </Container>
  );
}
