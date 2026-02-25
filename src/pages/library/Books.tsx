/**
 * Books — Book tracking profiles (no fake lists)
 */
import { Container, SimpleGrid, Text, Anchor, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';

const profiles = [
    {
        name: 'OpenLibrary', user: IDENTITY.usernames.openlibrary,
        url: `https://openlibrary.org/people/${IDENTITY.usernames.openlibrary}`,
        desc: 'Reading lists and shelves'
    },
    {
        name: 'Hardcover', user: IDENTITY.usernames.hardcover,
        url: `https://hardcover.app/@${IDENTITY.usernames.hardcover}`,
        desc: 'Book tracking and reviews'
    },
];

export default function Books() {
    usePageMeta({ title: 'Books', description: 'Reading' });
    return (
        <Container size="xl" py="xl">
            <PageHeader title="Books" description="What I read"
                breadcrumb={['Library', 'Books']} />
            <Text size="sm" c="dimmed" mb="xl">
                I track my reading on OpenLibrary and Hardcover. Visit the profiles for reading lists, shelves, and reviews.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {profiles.map((p) => (
                    <GlassCard key={p.name} hover>
                        <Text fw={600} size="sm" mb="xs">{p.name}</Text>
                        <Text size="xs" c="dimmed" mb="sm">{p.desc}</Text>
                        <Anchor href={p.url} target="_blank" size="xs">
                            <Group gap="xs">
                                <Text>@{p.user}</Text>
                                <IconExternalLink size={14} />
                            </Group>
                        </Anchor>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </Container>
    );
}
