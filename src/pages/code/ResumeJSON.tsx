/**
 * Resume JSON — Machine-readable resume viewer
 */
import {
  Container, Text, Code, Group, Button,
  CopyButton,
} from '@mantine/core';
import {
  IconDownload, IconCopy, IconCheck,
} from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { RESUME } from '@data/resume';

export default function ResumeJSON() {
  usePageMeta({
    title: 'Resume JSON',
    description: 'Machine-readable resume data',
  });
  const json = JSON.stringify(RESUME, null, 2);

  const handleDownload = () => {
    const blob = new Blob(
      [json], { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Resume JSON"
        description="Machine-readable format"
        breadcrumb={['Code', 'Resume JSON']}
      />
      <GlassCard mb="md">
        <Group justify="space-between" mb="md">
          <Text fw={600}>resume.json</Text>
          <Group gap="xs">
            <CopyButton value={json}>
              {({ copied, copy }) => (
                <Button
                  size="xs" variant="light"
                  leftSection={copied
                    ? <IconCheck size={14} />
                    : <IconCopy size={14} />}
                  onClick={copy}
                  color={copied
                    ? 'green' : 'blue'}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CopyButton>
            <Button
              size="xs" variant="light"
              leftSection={
                <IconDownload size={14} />
              }
              onClick={handleDownload}
            >
              Download
            </Button>
          </Group>
        </Group>
        <Code
          block
          style={{
            maxHeight: 500,
            overflow: 'auto',
            fontSize: '0.75rem',
          }}
        >
          {json}
        </Code>
      </GlassCard>
    </Container>
  );
}
