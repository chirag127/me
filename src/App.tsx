/**
 * Project Me — App Shell Layout
 * Mantine AppShell with: Header (top nav), Navbar (sidebar), Footer (dock)
 * All routes rendered via React Router Outlet
 */

import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    AppShell,
    Burger,
    Group,
    Text,
    NavLink,
    Menu,
    ActionIcon,
    Tooltip,
    Loader,
    Center,
    useMantineColorScheme,
    ScrollArea,
    Box,
    UnstyledButton,
    Divider,
} from '@mantine/core';
import {
    IconSun,
    IconMoon,
    IconSearch,
    IconBriefcase,
    IconCode,
    IconUser,
    IconBooks,
    IconDeviceGamepad2,
    IconWorld,
    IconSettings,
    IconFileText,
    IconRocket,
    IconFolder,
    IconPencil,
    IconMail,
    IconRobot,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { AnimatePresence, motion } from 'framer-motion';

import { routes, driveConfig, getRoutesByDrive } from './router';
import { useAppStore } from './stores/app-store';
import { CommandPalette } from './components/layout/CommandPalette';

/* ===== Drive Icon Map ===== */
const driveIcons: Record<string, React.ReactNode> = {
    WORK: <IconBriefcase size={18} />,
    CODE: <IconCode size={18} />,
    ME: <IconUser size={18} />,
    LIBRARY: <IconBooks size={18} />,
    GAMING: <IconDeviceGamepad2 size={18} />,
    CONNECT: <IconWorld size={18} />,
    SYSTEM: <IconSettings size={18} />,
};

/* ===== Dock Items ===== */
const dockItems = [
    { path: '/work', label: 'Resume', icon: <IconFileText size={22} /> },
    { path: '/work/projects', label: 'Projects', icon: <IconRocket size={22} /> },
    { path: '/code/repos', label: 'Repos', icon: <IconFolder size={22} /> },
    { path: '/me/journal-feed', label: 'Journal', icon: <IconPencil size={22} /> },
    { path: '/connect/mail', label: 'Contact', icon: <IconMail size={22} /> },
    { path: '/system/ai', label: 'AI Chat', icon: <IconRobot size={22} /> },
];

/* ===== Page transition variants ===== */
const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: { duration: 0.15, ease: 'easeIn' as const },
    },
};

/* ===== Loading Fallback ===== */
function PageLoader() {
    return (
        <Center h="60vh">
            <Loader size="lg" type="dots" />
        </Center>
    );
}

/* ===== App Component ===== */
export default function App() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const location = useLocation();
    const navigate = useNavigate();

    /* Find active drive */
    const activeDrive =
        routes.find((r) => r.path === location.pathname)?.drive ??
        driveConfig.find((d) => location.pathname.startsWith(`/${d.id.toLowerCase()}`))?.id ??
        'ME';

    return (
        <>
            <CommandPalette />
            <AppShell
                header={{ height: 56 }}
                navbar={{
                    width: 240,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                footer={{ height: 56 }}
                padding="md"
                styles={{
                    main: {
                        background:
                            colorScheme === 'dark'
                                ? 'linear-gradient(180deg, #0a0a0f 0%, #0d0d1a 100%)'
                                : 'linear-gradient(180deg, #f8f9fa 0%, #fff 100%)',
                    },
                    header: {
                        backdropFilter: 'blur(20px)',
                        background:
                            colorScheme === 'dark'
                                ? 'rgba(10, 10, 15, 0.85)'
                                : 'rgba(255, 255, 255, 0.85)',
                        borderBottom:
                            colorScheme === 'dark'
                                ? '1px solid rgba(255,255,255,0.06)'
                                : '1px solid rgba(0,0,0,0.08)',
                    },
                    navbar: {
                        backdropFilter: 'blur(20px)',
                        background:
                            colorScheme === 'dark'
                                ? 'rgba(10, 10, 15, 0.9)'
                                : 'rgba(255, 255, 255, 0.9)',
                        borderRight:
                            colorScheme === 'dark'
                                ? '1px solid rgba(255,255,255,0.06)'
                                : '1px solid rgba(0,0,0,0.08)',
                    },
                    footer: {
                        backdropFilter: 'blur(20px)',
                        background:
                            colorScheme === 'dark'
                                ? 'rgba(10, 10, 15, 0.85)'
                                : 'rgba(255, 255, 255, 0.85)',
                        borderTop:
                            colorScheme === 'dark'
                                ? '1px solid rgba(255,255,255,0.06)'
                                : '1px solid rgba(0,0,0,0.08)',
                    },
                }}
            >
                {/* ═══ HEADER (Top Nav) ═══ */}
                <AppShell.Header>
                    <Group h="100%" px="md" justify="space-between">
                        <Group gap="xs">
                            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                            <Text
                                size="lg"
                                fw={700}
                                style={{
                                    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    cursor: 'pointer',
                                }}
                                onClick={() => navigate('/me')}
                            >
                                CS
                            </Text>
                        </Group>

                        {/* Drive Menus */}
                        <Group gap={4} visibleFrom="sm">
                            {driveConfig.map((drive) => (
                                <Menu key={drive.id} shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={200}>
                                    <Menu.Target>
                                        <UnstyledButton
                                            px="sm"
                                            py={4}
                                            style={(theme) => ({
                                                borderRadius: theme.radius.sm,
                                                fontWeight: activeDrive === drive.id ? 600 : 400,
                                                fontSize: '0.875rem',
                                                color:
                                                    activeDrive === drive.id
                                                        ? drive.color
                                                        : colorScheme === 'dark'
                                                            ? theme.colors.gray[4]
                                                            : theme.colors.gray[7],
                                                '&:hover': {
                                                    background:
                                                        colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                                                },
                                            })}
                                        >
                                            {drive.name}
                                        </UnstyledButton>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        {getRoutesByDrive(drive.id).map((route) => (
                                            <Menu.Item
                                                key={route.path}
                                                leftSection={<Text size="sm">{route.icon}</Text>}
                                                onClick={() => {
                                                    navigate(route.path);
                                                    toggleMobile();
                                                }}
                                                style={{
                                                    fontWeight: location.pathname === route.path ? 600 : 400,
                                                }}
                                            >
                                                {route.name}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Dropdown>
                                </Menu>
                            ))}
                        </Group>

                        {/* Right Actions */}
                        <Group gap="xs">
                            <Tooltip label="Search (Ctrl+K)">
                                <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    onClick={() => useAppStore.getState().setSearchOpen(true)}
                                >
                                    <IconSearch size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
                                <ActionIcon variant="subtle" size="lg" onClick={() => toggleColorScheme()}>
                                    {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>
                </AppShell.Header>

                {/* ═══ SIDEBAR (Navbar) ═══ */}
                <AppShell.Navbar>
                    <AppShell.Section grow component={ScrollArea} scrollbarSize={4}>
                        <Box p="xs">
                            {driveConfig.map((drive) => {
                                const driveRoutes = getRoutesByDrive(drive.id);
                                const categories = [...new Set(driveRoutes.map((r) => r.category).filter(Boolean))];
                                const isActive = activeDrive === drive.id;

                                return (
                                    <NavLink
                                        key={drive.id}
                                        label={drive.name}
                                        leftSection={driveIcons[drive.id]}
                                        defaultOpened={isActive}
                                        childrenOffset={16}
                                        style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                    >
                                        {categories.length > 0
                                            ? categories.map((cat) => {
                                                const catRoutes = driveRoutes.filter((r) => r.category === cat);
                                                return (
                                                    <Box key={cat}>
                                                        <Text size="xs" c="dimmed" fw={600} mt="xs" mb={4} ml="xs" tt="uppercase">
                                                            {cat}
                                                        </Text>
                                                        {catRoutes.map((route) => (
                                                            <NavLink
                                                                key={route.path}
                                                                label={route.name}
                                                                leftSection={<Text size="sm">{route.icon}</Text>}
                                                                active={location.pathname === route.path}
                                                                onClick={() => {
                                                                    navigate(route.path);
                                                                    toggleMobile();
                                                                }}
                                                                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                                            />
                                                        ))}
                                                    </Box>
                                                );
                                            })
                                            : driveRoutes.map((route) => (
                                                <NavLink
                                                    key={route.path}
                                                    label={route.name}
                                                    leftSection={<Text size="sm">{route.icon}</Text>}
                                                    active={location.pathname === route.path}
                                                    onClick={() => {
                                                        navigate(route.path);
                                                        toggleMobile();
                                                    }}
                                                    style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                                />
                                            ))}
                                    </NavLink>
                                );
                            })}
                        </Box>
                    </AppShell.Section>
                </AppShell.Navbar>

                {/* ═══ MAIN CONTENT ═══ */}
                <AppShell.Main>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ minHeight: '60vh' }}
                        >
                            <Suspense fallback={<PageLoader />}>
                                <Routes location={location}>
                                    <Route path="/" element={<Navigate to="/me" replace />} />
                                    {routes.map((route) => (
                                        <Route key={route.path} path={route.path} element={<route.Component />} />
                                    ))}
                                    {/* Fallback: redirect unknown paths to Dashboard */}
                                    <Route path="*" element={<Navigate to="/me" replace />} />
                                </Routes>
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </AppShell.Main>

                {/* ═══ FOOTER (Bottom Dock) ═══ */}
                <AppShell.Footer>
                    <Group h="100%" justify="center" gap="xs" className="dock-container">
                        {dockItems.map((item) => (
                            <Tooltip key={item.path} label={item.label} position="top">
                                <ActionIcon
                                    variant={location.pathname === item.path ? 'light' : 'subtle'}
                                    size={44}
                                    radius="xl"
                                    onClick={() => {
                                        navigate(item.path);
                                        toggleMobile();
                                    }}
                                    style={{
                                        transition: 'transform 0.2s ease, background 0.2s ease',
                                    }}
                                    className={location.pathname === item.path ? 'dock-item active' : 'dock-item'}
                                >
                                    {item.icon}
                                </ActionIcon>
                            </Tooltip>
                        ))}
                        <Divider orientation="vertical" />
                        <Tooltip label="Search" position="top">
                            <ActionIcon
                                variant="subtle"
                                size={44}
                                radius="xl"
                                onClick={() => useAppStore.getState().setSearchOpen(true)}
                            >
                                <IconSearch size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
