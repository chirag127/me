/**
 * FinancialAnalytics — Auth-gated placeholder
 */
import { Container, Text, Stack } from '@mantine/core';
import { IconLock, IconChartBar } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { useAuth } from '@hooks/useAuth';

export default function FinancialAnalytics() {
  usePageMeta({
    title: 'Finance',
    description: 'Personal finance overview',
  });
  const { user } = useAuth();
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Finance"
        description="Personal finance overview"
        breadcrumb={['Me', 'Finance']}
      />
      <GlassCard>
        <Stack align="center" gap="md" py="xl">
          {!user ? (
            <>
              <IconLock size={48}
                opacity={0.3} />
              <Text c="dimmed" ta="center">
                Sign in to view financial data
              </Text>
            </>
          ) : (
            <>
              <IconChartBar size={48}
                opacity={0.3} />
              <Text fw={600}>
                No financial data yet
              </Text>
              <Text size="sm" c="dimmed"
                ta="center" maw={400}>
                Income and savings charts will
                appear once data is configured.
              </Text>
            </>
          )}
        </Stack>
      </GlassCard>
    </Container>
  );
}
