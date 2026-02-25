/**
 * Settings — App configuration
 */
import { Container, Switch, Stack, Text, Group, Select, Divider } from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

export default function Settings() {
  usePageMeta({ title: 'Settings', description: 'App configuration' });
  return (
    <Container size="xl" py="xl">
      <PageHeader title="Settings" description="App configuration"
        breadcrumb={['System', 'Settings']} />
      <GlassCard mb="md">
        <Text fw={600} mb="md">Appearance</Text>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text size="sm">Dark Mode</Text>
              <Text size="xs" c="dimmed">Toggle dark/light theme</Text>
            </div>
            <Switch defaultChecked />
          </Group>
          <Group justify="space-between">
            <div>
              <Text size="sm">Animations</Text>
              <Text size="xs" c="dimmed">Enable page transitions</Text>
            </div>
            <Switch defaultChecked />
          </Group>
          <Group justify="space-between">
            <div>
              <Text size="sm">Compact Mode</Text>
              <Text size="xs" c="dimmed">Reduce spacing</Text>
            </div>
            <Switch />
          </Group>
        </Stack>
      </GlassCard>
      <GlassCard mb="md">
        <Text fw={600} mb="md">Preferences</Text>
        <Stack gap="md">
          <Select label="Default Drive" data={['Me', 'Work', 'Code', 'Library']}
            defaultValue="Me" />
          <Select label="Chart Style" data={['Gradient', 'Solid', 'Outline']}
            defaultValue="Gradient" />
        </Stack>
      </GlassCard>
      <GlassCard>
        <Text fw={600} mb="md">Data</Text>
        <Stack gap="md">
          <Group justify="space-between">
            <div>
              <Text size="sm">Analytics</Text>
              <Text size="xs" c="dimmed">Allow anonymous usage data</Text>
            </div>
            <Switch defaultChecked />
          </Group>
        </Stack>
      </GlassCard>
    </Container>
  );
}
