/**
 * MusicHub tab panel sub-components.
 * Split out to keep MusicHub.tsx under 500 lines.
 */
import { useState, useEffect } from 'react';
import {
    SimpleGrid, Text, Anchor, Group,
    Skeleton, Badge, Box, Image
} from '@mantine/core';
import {
    IconExternalLink, IconBrandYoutube,
} from '@tabler/icons-react';
import { GlassCard } from '@components/ui/GlassCard';
import { IDENTITY } from '@data/identity';
import type {
    LastFmTrack, LastFmTopTrack,
    LastFmTopArtist, LastFmTopAlbum,
} from '@services/media';

/* ── constants ── */
const LFM = IDENTITY.usernames.lastfm;

const profiles = [
    {
        name: 'Last.fm', user: LFM,
        url: `https://www.last.fm/user/${LFM}`,
        desc: 'Scrobble history & stats',
    },
    {
        name: 'ListenBrainz',
        user: IDENTITY.usernames.listenbrainz,
        url: `https://listenbrainz.org/user/${IDENTITY.usernames.listenbrainz}`,
        desc: 'Open music tracking',
    },
    {
        name: 'SoundCloud',
        user: IDENTITY.usernames.soundcloud,
        url: `https://soundcloud.com/${IDENTITY.usernames.soundcloud}`,
        desc: 'Mixes & playlists',
    },
];

const quickLinks = [
    {
        label: 'Listening Report',
        url: `https://www.last.fm/user/${LFM}/listening-report`,
        desc: 'Weekly charts & reports',
    },
    {
        label: 'Genre Tags',
        url: `https://www.last.fm/user/${LFM}/tags`,
        desc: 'Genre breakdown & cloud',
    },
    {
        label: 'Library Overview',
        url: `https://www.last.fm/user/${LFM}/library`,
        desc: 'Full scrobble library',
    },
];

const concerts = [
    {
        artist: 'Local Band Night',
        venue: 'University Auditorium',
        date: '2023', type: 'Live',
    },
    {
        artist: 'College Fest',
        venue: 'Campus Ground',
        date: '2022', type: 'Festival',
    },
];

/* ── helpers ── */
export const ytSearch = (q: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

/**
 * Pick best non-empty image from Last.fm array.
 * Last.fm often returns empty strings for artists.
 */
export const pickImg = (
    imgs?: Array<{ '#text': string; size: string }>,
): string | undefined => {
    if (!imgs?.length) return undefined;
    // prefer extralarge > large > index 3 > 2
    for (const sz of ['extralarge', 'large', 'medium']) {
        const found = imgs.find(
            (i) => i.size === sz && i['#text']?.trim()
        );
        if (found) return found['#text'];
    }
    // fallback: first non-empty in array
    const any = imgs.find(
        (i) => i['#text']?.trim()
    );
    return any?.['#text'] || undefined;
};

/** Generate a robust fallback avatar URL */
const artistAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;

const PLACEHOLDER =
    'https://placehold.co/64x64/1a1b1e/666?text=%E2%99%AB';

/* ── Deezer Image Component ── */

const imageCache = new Map<string, string>();

function DeezerImage({ type, query, fallback, ...props }: { type: 'artist' | 'track' | 'album', query: string, fallback: string } & Record<string, any>) {
    const [src, setSrc] = useState<string>(fallback);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const cacheKey = `${type}:${query}`;
        if (imageCache.has(cacheKey)) {
            setSrc(imageCache.get(cacheKey)!);
            setLoaded(true);
            return;
        }

        let isMounted = true;
        const url = `https://api.deezer.com/search/${type}?q=${encodeURIComponent(query)}&limit=1`;

        // Use JSONP-like proxy if needed, but Deezer usually allows CORS for search
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!isMounted) return;
                let imgUrl = fallback;
                if (data.data && data.data.length > 0) {
                    const item = data.data[0];
                    if (type === 'artist') imgUrl = item.picture_medium || item.picture;
                    if (type === 'track') imgUrl = item.album?.cover_medium || item.album?.cover;
                    if (type === 'album') imgUrl = item.cover_medium || item.cover;
                }
                if (imgUrl) {
                    imageCache.set(cacheKey, imgUrl);
                    setSrc(imgUrl);
                }
                setLoaded(true);
            })
            .catch(() => {
                if (isMounted) setLoaded(true);
            });

        return () => { isMounted = false; };
    }, [type, query, fallback]);

    return (
        <Image
            src={src}
            fallbackSrc={fallback}
            style={{ opacity: loaded ? 1 : 0.5, transition: 'opacity 0.3s' }}
            {...props}
        />
    );
}

/* ── Tab panels ── */

/** Overview — profiles + quick links + concerts */
export function OverviewTab() {
    return (
        <>
            <Text size="sm" c="dimmed" mb="lg">
                Real-time listening stats across
                platforms. Every card is clickable.
            </Text>

            <SectionTitle text="Profiles" />
            <SimpleGrid
                cols={{ base: 1, sm: 3 }}
                spacing="md" mb="xl"
            >
                {profiles.map((p) => (
                    <Anchor
                        key={p.name} href={p.url}
                        target="_blank" underline="never"
                    >
                        <GlassCard hover>
                            <Text fw={600} size="sm" mb={4}>
                                {p.name}
                            </Text>
                            <Text size="xs" c="dimmed" mb="sm">
                                {p.desc}
                            </Text>
                            <Group gap="xs">
                                <Text size="xs">@{p.user}</Text>
                                <IconExternalLink size={14} />
                            </Group>
                        </GlassCard>
                    </Anchor>
                ))}
            </SimpleGrid>

            <SectionTitle text="Charts & Genres" />
            <SimpleGrid
                cols={{ base: 1, sm: 3 }}
                spacing="md" mb="xl"
            >
                {quickLinks.map((l) => (
                    <Anchor
                        key={l.label} href={l.url}
                        target="_blank" underline="never"
                    >
                        <GlassCard hover>
                            <Text fw={600} size="sm" mb={4}>
                                {l.label}
                            </Text>
                            <Text size="xs" c="dimmed" mb="sm">
                                {l.desc}
                            </Text>
                            <Group gap="xs">
                                <Text size="xs">
                                    View on Last.fm →
                                </Text>
                                <IconExternalLink size={14} />
                            </Group>
                        </GlassCard>
                    </Anchor>
                ))}
            </SimpleGrid>

            <SectionTitle text="Concerts & Events" />
            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="md"
            >
                {concerts.map((c) => (
                    <Anchor
                        key={c.artist}
                        href={ytSearch(c.artist)}
                        target="_blank" underline="never"
                    >
                        <GlassCard hover>
                            <Group
                                justify="space-between"
                                mb="xs"
                            >
                                <Text fw={600} size="sm">
                                    {c.artist}
                                </Text>
                                <Badge
                                    size="xs"
                                    variant="light"
                                >
                                    {c.type}
                                </Badge>
                            </Group>
                            <Text size="xs" c="dimmed">
                                {c.venue} · {c.date}
                            </Text>
                        </GlassCard>
                    </Anchor>
                ))}
            </SimpleGrid>
        </>
    );
}

/** Recent tracks with album cover art */
export function RecentTab(
    { tracks }: { tracks: LastFmTrack[] | null },
) {
    if (!tracks) return <SkeletonGrid />;
    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="md"
        >
            {tracks.map((t, i) => (
                <Anchor
                    key={`${t.name}-${i}`}
                    href={ytSearch(
                        `${t.artist['#text']} ${t.name}`
                    )}
                    target="_blank" underline="never"
                >
                    <GlassCard hover style={rowStyle}>
                        <DeezerImage
                            type="track"
                            query={`${t.artist['#text']} ${t.name}`}
                            fallback={pickImg(t.image) || PLACEHOLDER}
                            alt={t.name}
                            w={56} h={56} radius="md"
                        />
                        <Box style={flexBox}>
                            <Group
                                justify="space-between"
                                wrap="nowrap" mb={2}
                            >
                                <Text
                                    fw={600} size="sm"
                                    truncate
                                >
                                    {t.name}
                                </Text>
                                {t['@attr']?.nowplaying
                                    === 'true' && (
                                        <Badge
                                            size="xs"
                                            color="green"
                                            variant="dot"
                                        >
                                            Live
                                        </Badge>
                                    )}
                            </Group>
                            <Text
                                size="xs" c="dimmed"
                                truncate
                            >
                                {t.artist['#text']}
                            </Text>
                            <YtHint />
                        </Box>
                    </GlassCard>
                </Anchor>
            ))}
        </SimpleGrid>
    );
}

/** Top tracks with cover art & play counts */
export function TopTracksTab(
    { tracks }: {
        tracks: LastFmTopTrack[] | null;
    },
) {
    if (!tracks) return <SkeletonGrid />;
    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="md"
        >
            {tracks.map((t, i) => (
                <Anchor
                    key={`${t.name}-${i}`}
                    href={ytSearch(
                        `${t.artist.name} ${t.name}`
                    )}
                    target="_blank" underline="never"
                >
                    <GlassCard hover style={rowStyle}>
                        <DeezerImage
                            type="track"
                            query={`${t.artist.name} ${t.name}`}
                            fallback={pickImg(t.image) || PLACEHOLDER}
                            alt={t.name}
                            w={56} h={56} radius="md"
                        />
                        <Box style={flexBox}>
                            <Text
                                fw={600} size="sm"
                                truncate
                            >
                                {t.name}
                            </Text>
                            <Text
                                size="xs" c="dimmed"
                                truncate mb={4}
                            >
                                {t.artist.name}
                            </Text>
                            <Group
                                justify="space-between"
                            >
                                <Badge
                                    size="xs"
                                    variant="light"
                                    color="blue"
                                >
                                    {t.playcount} plays
                                </Badge>
                                <IconBrandYoutube
                                    size={14}
                                    opacity={0.5}
                                />
                            </Group>
                        </Box>
                    </GlassCard>
                </Anchor>
            ))}
        </SimpleGrid>
    );
}

/** Top albums with cover art */
export function TopAlbumsTab(
    { albums }: {
        albums: LastFmTopAlbum[] | null;
    },
) {
    if (!albums) return <SkeletonGrid count={8} h={120} />;
    return (
        <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4 }}
            spacing="md"
        >
            {albums.map((a, i) => (
                <Anchor
                    key={`${a.name}-${i}`}
                    href={ytSearch(
                        `${a.artist.name} ${a.name} album`
                    )}
                    target="_blank" underline="never"
                >
                    <GlassCard
                        hover
                        style={{
                            padding: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <DeezerImage
                            type="album"
                            query={`${a.artist.name} ${a.name}`}
                            fallback={pickImg(a.image) || PLACEHOLDER}
                            alt={a.name}
                            h={140} fit="cover"
                        />
                        <Box p="xs">
                            <Text
                                fw={600} size="xs"
                                lineClamp={1}
                            >
                                {a.name}
                            </Text>
                            <Text
                                size="xs" c="dimmed"
                                lineClamp={1}
                            >
                                {a.artist.name}
                            </Text>
                            <Badge
                                size="xs"
                                variant="light"
                                color="blue" mt={4}
                            >
                                {a.playcount} plays
                            </Badge>
                        </Box>
                    </GlassCard>
                </Anchor>
            ))}
        </SimpleGrid>
    );
}

/** Top artists with robust image fallback */
export function TopArtistsTab(
    { artists }: {
        artists: LastFmTopArtist[] | null;
    },
) {
    if (!artists) {
        return <SkeletonGrid count={8} h={160} />;
    }
    return (
        <SimpleGrid
            cols={{ base: 2, sm: 3, md: 4 }}
            spacing="md"
        >
            {artists.map((a, i) => {
                const fallback = pickImg(a.image) || artistAvatar(a.name);
                return (
                    <Anchor
                        key={`${a.name}-${i}`}
                        href={ytSearch(
                            `${a.name} official`
                        )}
                        target="_blank"
                        underline="never"
                    >
                        <GlassCard
                            hover
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '16px',
                                position: 'relative',
                            }}
                        >
                            <Text
                                fw={800} size="md"
                                c="dimmed"
                                style={{
                                    position: 'absolute',
                                    top: 8, left: 12,
                                    opacity: 0.2,
                                }}
                            >
                                #{i + 1}
                            </Text>
                            <DeezerImage
                                type="artist"
                                query={a.name}
                                fallback={fallback}
                                alt={a.name}
                                w={72} h={72} radius="100%"
                                mb="sm"
                            />
                            <Text
                                fw={600} size="sm"
                                lineClamp={1}
                            >
                                {a.name}
                            </Text>
                            <Badge
                                size="xs"
                                variant="light"
                                color="blue"
                                mt={4} mb={6}
                            >
                                {a.playcount} plays
                            </Badge>
                            <YtHint />
                        </GlassCard>
                    </Anchor>
                );
            })}
        </SimpleGrid>
    );
}

/* ── shared micro-components ── */

function SectionTitle({ text }: { text: string }) {
    return (
        <Text
            fw={700} size="sm"
            className="gradient-text" mb="sm"
        >
            {text}
        </Text>
    );
}

function YtHint() {
    return (
        <Group gap={4} mt={4}>
            <IconBrandYoutube size={12} opacity={0.5} />
            <Text
                size="xs" c="dimmed"
                style={{ fontSize: 10 }}
            >
                YouTube
            </Text>
        </Group>
    );
}

function SkeletonGrid(
    { count = 6, h = 90 }: {
        count?: number; h?: number;
    },
) {
    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3 }}
            spacing="md"
        >
            {Array(count).fill(0).map((_, i) => (
                <Skeleton
                    key={i} height={h} radius="md"
                />
            ))}
        </SimpleGrid>
    );
}

/* ── shared styles ── */
const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '10px',
};
const flexBox: React.CSSProperties = {
    flex: 1, minWidth: 0,
};
