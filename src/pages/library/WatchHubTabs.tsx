/**
 * WatchHub tab panel sub-components.
 * Split out to keep WatchHub.tsx under 500 lines.
 */
import {
    SimpleGrid, Text, Anchor, Group,
    Skeleton, Badge, Box, Image, Stack,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { GlassCard } from '@components/ui/GlassCard';
import { StatCard } from '@components/ui/StatCard';
import { IDENTITY } from '@data/identity';
import {
    getImdbPosterUrl,
    type TraktMovie,
    type TraktShowHistory,
} from '@services/media';

/* ── constants ─────────────────────── */
const TRAKT = IDENTITY.usernames.trakt;
const LB = IDENTITY.usernames.letterboxd;

const POSTER_FALLBACK =
    'https://placehold.co/200x300/1a1b1e/666' +
    '?text=%F0%9F%8E%AC';

const profiles = [
    {
        name: 'Trakt',
        user: TRAKT,
        url: `https://trakt.tv/users/${TRAKT}`,
        desc: 'Watch history & ratings',
    },
    {
        name: 'Letterboxd',
        user: LB,
        url: `https://letterboxd.com/${LB}`,
        desc: 'Film diary & reviews',
    },
];

const ratingLinks = [
    {
        label: 'Trakt Ratings',
        url: `https://trakt.tv/users/${TRAKT}/ratings`,
        desc: 'Movie & TV ratings',
    },
    {
        label: 'Letterboxd Ratings',
        url: `https://letterboxd.com/${LB}/films/ratings/`,
        desc: 'Film ratings & stars',
    },
    {
        label: 'Trakt Stats',
        url: `https://trakt.tv/users/${TRAKT}/stats`,
        desc: 'Viewing statistics',
    },
    {
        label: 'Letterboxd Stats',
        url: `https://letterboxd.com/${LB}/stats/`,
        desc: 'All-time film stats',
    },
];

const collection = [
    { cat: 'Blu-rays', count: 15, icon: '📀' },
    { cat: 'Vinyl Records', count: 5, icon: '💿' },
    { cat: 'Books (Physical)', count: 25, icon: '📚' },
    { cat: 'Comics/Manga', count: 10, icon: '📖' },
    { cat: 'Games', count: 30, icon: '🎮' },
    { cat: 'Posters', count: 8, icon: '🖼️' },
];

const lists = [
    {
        name: 'All-Time Favorites',
        count: 20, icon: '⭐',
        desc: 'Personal hall of fame',
    },
    {
        name: 'Mind-Bending Films',
        count: 15, icon: '🧠',
        desc: 'Nolan, Villeneuve, Tarkovsky',
    },
    {
        name: 'Best Soundtracks',
        count: 12, icon: '🎵',
        desc: 'Hans Zimmer and beyond',
    },
    {
        name: 'Binge-Worthy TV',
        count: 18, icon: '📺',
        desc: 'Series worth the time',
    },
    {
        name: 'Must-Read Books',
        count: 10, icon: '📚',
        desc: 'Tech and sci-fi essentials',
    },
    {
        name: 'Hidden Gems',
        count: 8, icon: '💎',
        desc: 'Underrated masterpieces',
    },
];

const activity = [
    {
        action: 'Watched',
        item: 'Dune: Part Two',
        time: '2h ago',
    },
    {
        action: 'Listened',
        item: 'Time — Hans Zimmer',
        time: '4h ago',
    },
    {
        action: 'Read',
        item: 'Designing Data-Intensive Apps',
        time: '1d ago',
    },
    {
        action: 'Watched',
        item: 'Severance S02E04',
        time: '2d ago',
    },
    {
        action: 'Listened',
        item: 'Comfortably Numb — Pink Floyd',
        time: '3d ago',
    },
];

/* ── helpers ────────────────────────── */
const actColor = (a: string) =>
    a === 'Watched'
        ? 'blue'
        : a === 'Listened'
            ? 'pink'
            : 'teal';

/* ── Tab panels ────────────────────── */

/** Overview — profile cards + quick stats */
export function OverviewTab() {
    return (
        <>
            <Text size="sm" c="dimmed" mb="lg">
                Track my movies & TV shows across
                platforms. Every card is clickable.
            </Text>
            <SectionTitle text="Profiles" />
            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="md" mb="xl"
            >
                {profiles.map((p) => (
                    <Anchor
                        key={p.name} href={p.url}
                        target="_blank"
                        underline="never"
                    >
                        <GlassCard hover>
                            <Text
                                fw={600} size="sm"
                                mb={4}
                            >
                                {p.name}
                            </Text>
                            <Text
                                size="xs" c="dimmed"
                                mb="sm"
                            >
                                {p.desc}
                            </Text>
                            <Group gap="xs">
                                <Text size="xs">
                                    @{p.user}
                                </Text>
                                <IconExternalLink
                                    size={14}
                                />
                            </Group>
                        </GlassCard>
                    </Anchor>
                ))}
            </SimpleGrid>
            <SectionTitle text="Quick Stats" />
            <SimpleGrid
                cols={{ base: 2, sm: 4 }}
                spacing="md"
            >
                <StatCard
                    label="Movies" value="100+"
                    icon="🎬" color="#5856D6"
                />
                <StatCard
                    label="TV Shows" value="50+"
                    icon="📺" color="#34C759"
                />
                <StatCard
                    label="Watching" value="2"
                    icon="▶️" color="#007AFF"
                />
                <StatCard
                    label="Collection" value="93"
                    icon="📦" color="#FF9500"
                />
            </SimpleGrid>
        </>
    );
}

/** Movies — poster grid from Trakt API */
export function MoviesTab(
    { movies }: {
        movies: TraktMovie[] | null;
    },
) {
    if (!movies) return <SkeletonGrid h={280} />;
    if (!movies.length) {
        return (
            <Text c="dimmed" ta="center" py="xl">
                No recent movies found.
                Visit Trakt for full history.
            </Text>
        );
    }
    return (
        <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4 }}
            spacing="md"
        >
            {movies.map((m, i) => {
                const imdb =
                    m.movie.ids.imdb;
                const poster = imdb
                    ? getImdbPosterUrl(imdb)
                    : POSTER_FALLBACK;
                return (
                    <Anchor
                        key={`${m.movie.ids.trakt}-${i}`}
                        href={
                            `https://trakt.tv/movies/` +
                            m.movie.ids.slug
                        }
                        target="_blank"
                        underline="never"
                    >
                        <GlassCard
                            hover
                            style={{
                                padding: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={poster}
                                alt={m.movie.title}
                                h={280} fit="cover"
                                fallbackSrc={
                                    POSTER_FALLBACK
                                }
                            />
                            <Box p="xs">
                                <Text
                                    fw={600}
                                    size="xs"
                                    lineClamp={1}
                                >
                                    {m.movie.title}
                                </Text>
                                <Group
                                    justify="space-between"
                                >
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        {m.movie.year}
                                    </Text>
                                    <IconExternalLink
                                        size={12}
                                        opacity={0.5}
                                    />
                                </Group>
                            </Box>
                        </GlassCard>
                    </Anchor>
                );
            })}
        </SimpleGrid>
    );
}

/** TV Shows — poster grid with status */
export function TVShowsTab(
    { shows }: {
        shows: TraktShowHistory[] | null;
    },
) {
    if (!shows) return <SkeletonGrid h={280} />;
    if (!shows.length) {
        return (
            <Text c="dimmed" ta="center" py="xl">
                No shows found. Visit Trakt
                for full history.
            </Text>
        );
    }
    return (
        <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4 }}
            spacing="md"
        >
            {shows.map((s, i) => {
                const imdb =
                    s.show.ids.imdb;
                const poster = imdb
                    ? getImdbPosterUrl(imdb)
                    : POSTER_FALLBACK;
                const status =
                    s.show.status === 'ended'
                        || s.show.status
                        === 'canceled'
                        ? 'Completed'
                        : 'Watching';
                return (
                    <Anchor
                        key={`${s.show.ids.trakt}-${i}`}
                        href={
                            `https://trakt.tv/shows/` +
                            s.show.ids.slug
                        }
                        target="_blank"
                        underline="never"
                    >
                        <GlassCard
                            hover
                            style={{
                                padding: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                src={poster}
                                alt={s.show.title}
                                h={280} fit="cover"
                                fallbackSrc={
                                    POSTER_FALLBACK
                                }
                            />
                            <Box p="xs">
                                <Text
                                    fw={600}
                                    size="xs"
                                    lineClamp={1}
                                >
                                    {s.show.title}
                                </Text>
                                <Group
                                    justify="space-between"
                                >
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                    >
                                        {s.show.year}
                                    </Text>
                                    <Badge
                                        size="xs"
                                        variant="light"
                                        color={
                                            status
                                                === 'Watching'
                                                ? 'green'
                                                : 'blue'
                                        }
                                    >
                                        {status}
                                    </Badge>
                                </Group>
                                {s.show.rating && (
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        mt={2}
                                    >
                                        ⭐{' '}
                                        {s.show.rating
                                            .toFixed(1)}
                                        /10
                                    </Text>
                                )}
                            </Box>
                        </GlassCard>
                    </Anchor>
                );
            })}
        </SimpleGrid>
    );
}

/** Ratings — external profile links */
export function RatingsTab() {
    return (
        <>
            <Text size="sm" c="dimmed" mb="lg">
                Ratings tracked across Trakt and
                Letterboxd. Visit for real data.
            </Text>
            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="md"
            >
                {ratingLinks.map((l) => (
                    <Anchor
                        key={l.label} href={l.url}
                        target="_blank"
                        underline="never"
                    >
                        <GlassCard hover>
                            <Text
                                fw={600} size="sm"
                                mb="xs"
                            >
                                {l.label}
                            </Text>
                            <Text
                                size="xs" c="dimmed"
                                mb="sm"
                            >
                                {l.desc}
                            </Text>
                            <Group gap="xs">
                                <Text size="xs">
                                    View →
                                </Text>
                                <IconExternalLink
                                    size={14}
                                />
                            </Group>
                        </GlassCard>
                    </Anchor>
                ))}
            </SimpleGrid>
        </>
    );
}

/** Collection — physical/digital media */
export function CollectionTab() {
    return (
        <>
            <SimpleGrid
                cols={{ base: 2, sm: 3 }}
                spacing="md" mb="xl"
            >
                <StatCard
                    label="Total Items"
                    value="93" icon="📦"
                    color="#007AFF"
                />
                <StatCard
                    label="Categories"
                    value="6" icon="📂"
                    color="#5856D6"
                />
                <StatCard
                    label="Newest"
                    value="This week"
                    icon="🆕" color="#34C759"
                />
            </SimpleGrid>
            <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 3 }}
                spacing="md"
            >
                {collection.map((c) => (
                    <GlassCard
                        key={c.cat} hover
                    >
                        <Group gap="sm">
                            <Text size="xl">
                                {c.icon}
                            </Text>
                            <div>
                                <Text
                                    fw={600}
                                    size="sm"
                                >
                                    {c.cat}
                                </Text>
                                <Text
                                    size="xs"
                                    c="dimmed"
                                >
                                    {c.count} items
                                </Text>
                            </div>
                        </Group>
                    </GlassCard>
                ))}
            </SimpleGrid>
        </>
    );
}

/** Lists — curated media lists */
export function ListsTab() {
    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="md"
        >
            {lists.map((l) => (
                <GlassCard key={l.name} hover>
                    <Group gap="sm" mb="xs">
                        <Text size="xl">
                            {l.icon}
                        </Text>
                        <div>
                            <Text
                                fw={600} size="sm"
                            >
                                {l.name}
                            </Text>
                            <Badge
                                size="xs"
                                variant="light"
                            >
                                {l.count} items
                            </Badge>
                        </div>
                    </Group>
                    <Text
                        size="xs" c="dimmed"
                    >
                        {l.desc}
                    </Text>
                </GlassCard>
            ))}
        </SimpleGrid>
    );
}

/** Activity — watch + social feed */
export function ActivityTab() {
    return (
        <>
            <SimpleGrid
                cols={{ base: 2, sm: 3 }}
                spacing="md" mb="xl"
            >
                <StatCard
                    label="This Week" value="12"
                    icon="📊" color="#007AFF"
                />
                <StatCard
                    label="Streak" value="5 days"
                    icon="🔥" color="#FF2D55"
                />
                <StatCard
                    label="Friends" value="8"
                    icon="👥" color="#34C759"
                />
            </SimpleGrid>
            <SectionTitle
                text="Watch Activity"
            />
            <GlassCard>
                <Text
                    fw={600} mb="md"
                    className="gradient-text"
                >
                    Trakt Activity
                </Text>
                <Text
                    size="sm" c="dimmed" mb="md"
                >
                    Real-time watch history and
                    statistics tracked on Trakt.
                </Text>
                <Anchor
                    href={
                        `https://trakt.tv/users/` +
                        TRAKT
                    }
                    target="_blank" size="sm"
                >
                    <Group gap="xs">
                        <Text>View on Trakt →</Text>
                        <IconExternalLink
                            size={14}
                        />
                    </Group>
                </Anchor>
            </GlassCard>
            <SectionTitle text="Social Feed" />
            <Stack gap="sm">
                {activity.map((a, i) => (
                    <GlassCard key={i}>
                        <Group
                            justify="space-between"
                        >
                            <Group gap="xs">
                                <Badge
                                    size="xs"
                                    variant="light"
                                    color={
                                        actColor(
                                            a.action,
                                        )
                                    }
                                >
                                    {a.action}
                                </Badge>
                                <Text
                                    size="sm"
                                    fw={500}
                                >
                                    {a.item}
                                </Text>
                            </Group>
                            <Text
                                size="xs" c="dimmed"
                            >
                                {a.time}
                            </Text>
                        </Group>
                    </GlassCard>
                ))}
            </Stack>
        </>
    );
}

/* ── shared micro-components ───────── */

function SectionTitle(
    { text }: { text: string },
) {
    return (
        <Text
            fw={700} size="sm"
            className="gradient-text"
            mb="sm" mt="lg"
        >
            {text}
        </Text>
    );
}

function SkeletonGrid(
    { count = 8, h = 200 }: {
        count?: number; h?: number;
    },
) {
    return (
        <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4 }}
            spacing="md"
        >
            {Array(count)
                .fill(0)
                .map((_, i) => (
                    <Skeleton
                        key={i}
                        height={h}
                        radius="md"
                    />
                ))}
        </SimpleGrid>
    );
}
