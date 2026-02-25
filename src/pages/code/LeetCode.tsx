/**
 * LeetCode — Profile link (no fake data)
 */
import {
  Container, Text, Anchor, Group,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const lc = IDENTITY.usernames.leetcode;

export default function LeetCode() {
  usePageMeta({
    title: 'LeetCode',
    description: 'Competitive programming',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="LeetCode"
        description="Competitive programming"
        breadcrumb={['Code', 'LeetCode']}
      />

      <GlassCard mb="md">
        <Text fw={600} mb="md"
          className="gradient-text">
          LeetCode Profile
        </Text>
        <Text size="sm" c="dimmed" mb="md">
          View my solved problems, contest
          history, and ratings on LeetCode.
        </Text>
        <Anchor
          href={`https://leetcode.com/u/${lc}`}
          target="_blank" size="sm"
        >
          <Group gap="xs">
            <Text>leetcode.com/u/{lc}</Text>
            <IconExternalLink size={14} />
          </Group>
        </Anchor>
      </GlassCard>

      {/* LeetCode stats embed */}
      <GlassCard>
        <img
          src={`https://leetcard.jacoblin.cool/${lc}?theme=dark&font=Inter&ext=heatmap`}
          alt="LeetCode Stats"
          style={{ width: '100%' }}
        />
      </GlassCard>
    </Container>
  );
}
