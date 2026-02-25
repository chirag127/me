/**
 * ReadingCharts — OpenLibrary link (no fake)
 */
import { Container, Text, Anchor, Group, SimpleGrid } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

export default function ReadingCharts() {
    usePageMeta({ title: 'Reading Charts', description: 'Reading analytics' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Reading Charts" description="Reading analytics"
                breadcrumb={['Library', 'Books', 'Charts']} />
            <GlassCard mb="md">
                <Text fw={600} mb="md" className="gradient-text">Reading History</Text>
                <Text size="sm" c="dimmed" mb="md">
                    Reading stats are tracked on OpenLibrary and Hardcover.
                </Text>
            </GlassCard>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <GlassCard hover>
                    <Text fw={600} size="sm" mb="sm">OpenLibrary</Text>
                    <Anchor href={`https://openlibrary.org/people/${IDENTITY.usernames.openlibrary}`}
                        target="_blank" size="xs">
                        <Group gap="xs">
                            <Text>@{IDENTITY.usernames.openlibrary}</Text>
                            <IconExternalLink size={14} />
                        </Group>
                    </Anchor>
                </GlassCard>
                <GlassCard hover>
                    <Text fw={600} size="sm" mb="sm">Hardcover</Text>
                    <Anchor href={`https://hardcover.app/@${IDENTITY.usernames.hardcover}`}
                        target="_blank" size="xs">
                        <Group gap="xs">
                            <Text>@{IDENTITY.usernames.hardcover}</Text>
                            <IconExternalLink size={14} />
                        </Group>
                    </Anchor>
                </GlassCard>
            </SimpleGrid>
        </Container>
    );
}
