/**
 * Project Me — React Entry Point
 * Mounts the React app with MantineProvider and HashRouter
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import App from './App';

/* Mantine CSS — order matters */
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

/* App global styles */
import './index.css';

/* Initialize services lazily — don't block React mount */
(async () => {
    try {
        const { initServices } = await import('./services/init');
        initServices();
    } catch (e) {
        console.warn('[boot] initServices failed:', e);
    }
    try {
        const { initFirebase } = await import('./services/firebase');
        initFirebase();
    } catch (e) {
        console.warn('[boot] initFirebase failed:', e);
    }
    try {
        const { initJournalAuth } = await import('./services/journal');
        initJournalAuth();
    } catch (e) {
        console.warn('[boot] initJournalAuth failed:', e);
    }
})();

/**
 * Custom Mantine theme — professional dark palette with blue/purple accents
 */
const theme = createTheme({
    primaryColor: 'blue',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    fontFamilyMonospace: 'JetBrains Mono, ui-monospace, monospace',
    headings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        fontWeight: '700',
    },
    radius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
    },
    defaultRadius: 'md',
    colors: {
        /* Custom accent palette (blue-purple gradient feel) */
        brand: [
            '#e6f0ff',
            '#b3d4ff',
            '#80b8ff',
            '#4d9cff',
            '#1a80ff',
            '#007AFF',
            '#0062cc',
            '#004a99',
            '#003166',
            '#001933',
        ],
    },
    other: {
        gradientPrimary: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications position="top-right" />
            <HashRouter>
                <App />
            </HashRouter>
        </MantineProvider>
    </StrictMode>,
);
