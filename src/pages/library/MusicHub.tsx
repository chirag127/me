/**
 * MusicHub — Unified music dashboard with 7 tabs
 * Consolidates all music-related pages.
 */
import { useEffect, useState } from 'react';
import { Container, Tabs } from '@mantine/core';
import {
    IconChartBar, IconMusic, IconDisc,
    IconMicrophone2, IconVinyl,
} from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import {
    getLastFmRecentTracks,
    getLastFmTopTracks,
    getLastFmTopArtists,
    getLastFmTopAlbums,
    type LastFmTrack,
    type LastFmTopTrack,
    type LastFmTopArtist,
    type LastFmTopAlbum,
} from '@services/media';
import {
    OverviewTab,
    RecentTab,
    TopTracksTab,
    TopAlbumsTab,
    TopArtistsTab,
} from './MusicHubTabs';

export default function MusicHub() {
    usePageMeta({
        title: 'Music Hub',
        description: 'Real-time listening activity',
    });

    const [recent, setRecent] =
        useState<LastFmTrack[] | null>(null);
    const [topTracks, setTopTracks] =
        useState<LastFmTopTrack[] | null>(null);
    const [topArtists, setTopArtists] =
        useState<LastFmTopArtist[] | null>(null);
    const [topAlbums, setTopAlbums] =
        useState<LastFmTopAlbum[] | null>(null);

    useEffect(() => {
        getLastFmRecentTracks(15)
            .then(setRecent)
            .catch(() => setRecent([]));
        getLastFmTopTracks('1month', 15)
            .then(setTopTracks)
            .catch(() => setTopTracks([]));
        getLastFmTopArtists('1month', 15)
            .then(setTopArtists)
            .catch(() => setTopArtists([]));
        getLastFmTopAlbums('1month', 12)
            .then(setTopAlbums)
            .catch(() => setTopAlbums([]));
    }, []);

    return (
        <Container size="xl" py="xl">
            <PageHeader
                title="Music Hub"
                description="Real-time listening activity"
                breadcrumb={['Library', 'Music']}
            />
            <Tabs
                defaultValue="overview"
                variant="pills"
                radius="xl"
                mb="xl"
            >
                <Tabs.List mb="md">
                    <Tabs.Tab
                        value="overview"
                        leftSection={
                            <IconChartBar size={16} />
                        }
                    >
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="recent"
                        leftSection={
                            <IconMusic size={16} />
                        }
                    >
                        Recent
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="top-tracks"
                        leftSection={
                            <IconDisc size={16} />
                        }
                    >
                        Top Tracks
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="top-albums"
                        leftSection={
                            <IconVinyl size={16} />
                        }
                    >
                        Top Albums
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="top-artists"
                        leftSection={
                            <IconMicrophone2
                                size={16}
                            />
                        }
                    >
                        Top Artists
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="xs">
                    <OverviewTab />
                </Tabs.Panel>
                <Tabs.Panel value="recent" pt="xs">
                    <RecentTab tracks={recent} />
                </Tabs.Panel>
                <Tabs.Panel
                    value="top-tracks" pt="xs"
                >
                    <TopTracksTab
                        tracks={topTracks}
                    />
                </Tabs.Panel>
                <Tabs.Panel
                    value="top-albums" pt="xs"
                >
                    <TopAlbumsTab
                        albums={topAlbums}
                    />
                </Tabs.Panel>
                <Tabs.Panel
                    value="top-artists" pt="xs"
                >
                    <TopArtistsTab
                        artists={topArtists}
                    />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
