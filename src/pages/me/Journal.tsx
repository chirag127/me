/**
 * Journal — Write entries (auth-gated)
 */
import {
  Container, Textarea, Button, Group,
  Text, Stack,
} from '@mantine/core';
import { IconSend, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { useAuth } from '@hooks/useAuth';

export default function Journal() {
  usePageMeta({
    title: 'Journal',
    description: 'Write thoughts & reflections',
  });
  const { user } = useAuth();
  const [entry, setEntry] = useState('');

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal"
        description="Write thoughts & reflections"
        breadcrumb={['Me', 'Journal', 'Write']}
      />
      {!user ? (
        <GlassCard>
          <Stack align="center" gap="md" py="xl">
            <IconLock size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              Sign in to write journal entries
            </Text>
          </Stack>
        </GlassCard>
      ) : (
        <GlassCard>
          <Textarea
            placeholder="What's on your mind..."
            minRows={8} autosize
            value={entry}
            onChange={(e) =>
              setEntry(e.currentTarget.value)
            }
            mb="md"
          />
          <Group justify="flex-end">
            <Text size="xs" c="dimmed">
              {entry.length} characters
            </Text>
            <Button
              leftSection={
                <IconSend size={14} />
              }
              variant="gradient"
              gradient={{
                from: '#007AFF',
                to: '#5856D6',
              }}
              disabled={!entry.trim()}
            >
              Publish
            </Button>
          </Group>
        </GlassCard>
      )}
    </Container>
  );
}
