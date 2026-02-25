/**
 * Purchases — Purchase log (auth-gated)
 */
import {
  Container, Text, Stack,
} from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { useAuth } from '@hooks/useAuth';

export default function Purchases() {
  usePageMeta({
    title: 'Purchases',
    description: 'Purchase history',
  });
  const { user } = useAuth();
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Purchases"
        description="Purchase history"
        breadcrumb={['Me', 'Purchases']}
      />
      {!user ? (
        <GlassCard>
          <Stack align="center" gap="md" py="xl">
            <IconLock size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              Sign in to view purchase history
            </Text>
          </Stack>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text c="dimmed" ta="center" py="xl">
            Purchase data will sync
            from Firestore
          </Text>
        </GlassCard>
      )}
    </Container>
  );
}
