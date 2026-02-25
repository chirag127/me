/**
 * Contact — Contact form
 */
import { Container, TextInput, Textarea, Button, Stack, Group, Text } from '@mantine/core';
import { IconSend, IconMail } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function Contact() {
  usePageMeta({ title: 'Contact', description: 'Get in touch' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Contact" description="Get in touch"
        breadcrumb={['Connect', 'Contact']} />
      <GlassCard mb="xl">
        <Group gap="md" mb="md">
          <IconMail size={20} />
          <Text size="sm">{IDENTITY.email}</Text>
        </Group>
        <Text size="sm" c="dimmed">
          Feel free to reach out for collaborations, opportunities, or just to say hi.
        </Text>
      </GlassCard>
      <GlassCard>
        <Stack gap="md">
          <TextInput label="Name" placeholder="Your name" />
          <TextInput label="Email" placeholder="you@example.com" />
          <TextInput label="Subject" placeholder="What's this about?" />
          <Textarea label="Message" placeholder="Your message..." minRows={4} autosize />
          <Group justify="flex-end">
            <Button leftSection={<IconSend size={14} />}
              variant="gradient" gradient={{ from: '#007AFF', to: '#5856D6' }}>
              Send Message
            </Button>
          </Group>
        </Stack>
      </GlassCard>
    </Container>
  );
}
