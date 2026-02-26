/**
 * WatchHub — Unified Movies & TV dashboard
 * Consolidates all Movies & TV pages into
 * a single tabbed interface.
 */
import { useEffect, useState } from 'react';
import { Container, Tabs } from '@mantine/core';
import {
    IconChartBar, IconMovie,
    IconDeviceTv, IconStar,
    IconDisc, IconList, IconActivity,
} from '@tabler/icons-react';
import { usePageMeta } from '@hooks/usePageMeta';
import {
    PageHeader,
} from '@components/ui/PageHeader';
import {
    getTraktRecentMovies,
    getTraktWatchedShows,
    type TraktMovie,
    type TraktShowHistory,
} from '@services/media';
import {
    OverviewTab,
    MoviesTab,
    TVShowsTab,
    RatingsTab,
    CollectionTab,
    ListsTab,
    ActivityTab,
} from './WatchHubTabs';

export default function WatchHub() {
    usePageMeta({
        title: 'Watch Hub',
        description:
            'Movies & TV shows tracking',
    });

    const [movies, setMovies] = useState<
        TraktMovie[] | null
    >(null);
    const [shows, setShows] = useState<
        TraktShowHistory[] | null
    >(null);

    useEffect(() => {
        getTraktRecentMovies(16)
            .then(setMovies)
            .catch(() => setMovies([]));
        getTraktWatchedShows(16)
            .then(setShows)
            .catch(() => setShows([]));
    }, []);

    return (
        <Container size="xl" py="xl">
            <PageHeader
                title="Watch Hub"
                description={
                    'Movies & TV shows tracking'
                }
                breadcrumb={[
                    'Library', 'Watch',
                ]}
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
                            <IconChartBar
                                size={16}
                            />
                        }
                    >
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="movies"
                        leftSection={
                            <IconMovie
                                size={16}
                            />
                        }
                    >
                        Movies
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="tv-shows"
                        leftSection={
                            <IconDeviceTv
                                size={16}
                            />
                        }
                    >
                        TV Shows
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="ratings"
                        leftSection={
                            <IconStar
                                size={16}
                            />
                        }
                    >
                        Ratings
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="collection"
                        leftSection={
                            <IconDisc
                                size={16}
                            />
                        }
                    >
                        Collection
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="lists"
                        leftSection={
                            <IconList
                                size={16}
                            />
                        }
                    >
                        Lists
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="activity"
                        leftSection={
                            <IconActivity
                                size={16}
                            />
                        }
                    >
                        Activity
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel
                    value="overview" pt="xs"
                >
                    <OverviewTab />
                </Tabs.Panel>
                <Tabs.Panel
                    value="movies" pt="xs"
                >
                    <MoviesTab
                        movies={movies}
                    />
                </Tabs.Panel>
                <Tabs.Panel
                    value="tv-shows" pt="xs"
                >
                    <TVShowsTab
                        shows={shows}
                    />
                </Tabs.Panel>
                <Tabs.Panel
                    value="ratings" pt="xs"
                >
                    <RatingsTab />
                </Tabs.Panel>
                <Tabs.Panel
                    value="collection" pt="xs"
                >
                    <CollectionTab />
                </Tabs.Panel>
                <Tabs.Panel
                    value="lists" pt="xs"
                >
                    <ListsTab />
                </Tabs.Panel>
                <Tabs.Panel
                    value="activity" pt="xs"
                >
                    <ActivityTab />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
