/**
 * CommandPalette — ⌘K search using @mantine/spotlight
 */

import {
    Spotlight,
    type SpotlightActionData,
    spotlight,
} from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/router';
import { useEffect } from 'react';
import { useAppStore } from '@stores/app-store';

export function CommandPalette() {
    const navigate = useNavigate();
    const searchOpen = useAppStore((s) => s.searchOpen);
    const setSearchOpen = useAppStore(
        (s) => s.setSearchOpen
    );

    /* Sync Zustand state with Spotlight open */
    useEffect(() => {
        if (searchOpen) spotlight.open();
        else spotlight.close();
    }, [searchOpen]);

    const actions: SpotlightActionData[] = routes.map(
        (r) => ({
            id: r.path,
            label: r.name,
            description: `${r.drive} · ${r.breadcrumb.join(' / ')}`,
            leftSection: <span>{r.icon}</span>,
            onClick: () => {
                navigate(r.path);
                setSearchOpen(false);
            },
        })
    );

    return (
        <Spotlight
            actions={actions}
            nothingFound="No pages found"
            searchProps={{
                leftSection: <IconSearch size={18} />,
                placeholder: 'Search pages...',
            }}
            shortcut={['mod + K', '/']}
            onSpotlightClose={() => setSearchOpen(false)}
            onSpotlightOpen={() => setSearchOpen(true)}
            highlightQuery
            limit={10}
        />
    );
}
