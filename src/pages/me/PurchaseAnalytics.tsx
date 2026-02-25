/**
 * PurchaseAnalytics — Auth-gated placeholder
 */
import { Container, Text, Stack } from '@mantine/core';
import { IconLock, IconChartBar } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { useAuth } from '@hooks/useAuth';

export default function PurchaseAnalytics() {
  usePageMeta({
    title: 'Purchase Analytics',
    description: 'Spending insights',
  });
  const { user } = useAuth();
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Purchase Analytics"
        description="Spending insights"
        breadcrumb={[
          'Me', 'Purchases', 'Analytics',
        ]}
      />
      <GlassCard>
        <Stack align="center" gap="md" py="xl">
          {!user ? (
            <>
              <IconLock size={48}
                opacity={0.3} />
              <Text c="dimmed" ta="center">
                Sign in to view analytics
              </Text>
            </>
          ) : (
            <>
              <IconChartBar size={48}
                opacity={0.3} />
              <Text fw={600}>
                No purchase data yet
              </Text>
              <Text size="sm" c="dimmed"
                ta="center" maw={400}>
                Charts will appear here once
                purchase data syncs from
                Firestore.
              </Text>
            </>
          )}
        </Stack>
      </GlassCard>
    </Container>
  );
}
