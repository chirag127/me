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
                header={{ height: 80, offset: true }}
                navbar={{
                    width: 260,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                footer={{ height: 88, offset: true }}
                padding="md"
                styles={{
                    main: {
                        background:
                            colorScheme === 'dark'
                                ? 'linear-gradient(180deg, #05050A 0%, #0A0A14 100%)'
                                : 'linear-gradient(180deg, #F0F2F5 0%, #FFFFFF 100%)',
                    },
                    header: {
                        background: 'transparent',
                        borderBottom: 'none',
                    },
                    navbar: {
                        background: 'transparent',
                        borderRight: 'none',
                    },
                    footer: {
                        background: 'transparent',
                        borderTop: 'none',
                    },
                }}
            >
                {/* ═══ HEADER (Top Nav) ═══ */}
                <AppShell.Header withBorder={false} style={{ background: 'transparent' }}>
                    <Box pt="md" px="md">
                        <Group h={56} px="lg" justify="space-between" style={{
                            background: colorScheme === 'dark' ? 'rgba(20, 20, 25, 0.65)' : 'rgba(255, 255, 255, 0.65)',
                            backdropFilter: 'blur(24px)',
                            border: colorScheme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                            borderRadius: '16px',
                            boxShadow: colorScheme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)'
                        }}>
                            <Group gap="xs">
                                <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                                <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                                <Text
                                    size="xl"
                                    fw={800}
                                    style={{
                                        background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        cursor: 'pointer',
                                        letterSpacing: '-0.5px'
                                    }}
                                    onClick={() => navigate('/me')}
                                >
                                    CS
                                </Text>
                            </Group>

                            {/* Drive Menus */}
                            <Group gap={8} visibleFrom="sm">
                                {driveConfig.map((drive) => (
                                    <Menu key={drive.id} shadow="xl" width={220} trigger="hover" openDelay={50} closeDelay={100} transitionProps={{ transition: 'pop', duration: 150 }}>
                                        <Menu.Target>
                                            <UnstyledButton
                                                px={12}
                                                py={6}
                                                style={(theme) => ({
                                                    borderRadius: theme.radius.md,
                                                    fontWeight: activeDrive === drive.id ? 600 : 500,
                                                    fontSize: '0.9rem',
                                                    color:
                                                        activeDrive === drive.id
                                                            ? drive.color
                                                            : colorScheme === 'dark'
                                                                ? theme.colors.gray[3]
                                                                : theme.colors.gray[7],
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        background: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                })}
                                            >
                                                {drive.name}
                                            </UnstyledButton>
                                        </Menu.Target>
                                        <Menu.Dropdown style={{
                                            background: colorScheme === 'dark' ? 'rgba(30, 30, 35, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                                            backdropFilter: 'blur(20px)',
                                            border: colorScheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                                            borderRadius: '12px'
                                        }}>
                                            {getRoutesByDrive(drive.id).map((route) => (
                                                <Menu.Item
                                                    key={route.path}
                                                    leftSection={<Text size="md" c={drive.color}>{route.icon}</Text>}
                                                    onClick={() => {
                                                        navigate(route.path);
                                                        toggleMobile();
                                                    }}
                                                    style={{
                                                        fontWeight: location.pathname === route.path ? 600 : 500,
                                                        borderRadius: '8px',
                                                        margin: '4px',
                                                        transition: 'background 0.2s'
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
                            <Group gap="sm">
                                <Tooltip label="Search (Ctrl+K)" position="bottom" withArrow>
                                    <ActionIcon
                                        variant="light"
                                        size="lg"
                                        radius="md"
                                        onClick={() => useAppStore.getState().setSearchOpen(true)}
                                    >
                                        <IconSearch size={20} />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'} position="bottom" withArrow>
                                    <ActionIcon variant="light" size="lg" radius="md" onClick={() => toggleColorScheme()}>
                                        {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>
                    </Box>
                </AppShell.Header>

                {/* ═══ SIDEBAR (Navbar) ═══ */}
                <AppShell.Navbar withBorder={false} style={{ background: 'transparent' }}>
                    <Box pt="md" pl={{ base: 'md', sm: 'md' }} pb="md" pr={{ base: 'md', sm: 0 }} h="100%">
                        <AppShell.Section
                            grow
                            component={ScrollArea}
                            scrollbarSize={4}
                            h="100%"
                            style={{
                                background: colorScheme === 'dark' ? 'rgba(20, 20, 25, 0.65)' : 'rgba(255, 255, 255, 0.65)',
                                backdropFilter: 'blur(24px)',
                                border: colorScheme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                                borderRadius: '16px',
                                boxShadow: colorScheme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}
                        >
                            <Box p="md">
                                {driveConfig.map((drive) => {
                                    const driveRoutes = getRoutesByDrive(drive.id);
                                    const categories = [...new Set(driveRoutes.map((r) => r.category).filter(Boolean))];
                                    const isActive = activeDrive === drive.id;

                                    return (
                                        <NavLink
                                            key={drive.id}
                                            label={<Text fw={600} size="sm">{drive.name}</Text>}
                                            leftSection={<Text c={drive.color}>{driveIcons[drive.id]}</Text>}
                                            defaultOpened={isActive}
                                            childrenOffset={16}
                                            style={{ borderRadius: '8px', marginBottom: '4px', transition: 'background 0.2s' }}
                                        >
                                            {categories.length > 0
                                                ? categories.map((cat) => {
                                                    const catRoutes = driveRoutes.filter((r) => r.category === cat);
                                                    return (
                                                        <Box key={cat} mb="sm">
                                                            <Text size="xs" c="dimmed" fw={700} mt="md" mb={4} ml="xs" tt="uppercase" style={{ letterSpacing: 0.5 }}>
                                                                {cat}
                                                            </Text>
                                                            {catRoutes.map((route) => (
                                                                <NavLink
                                                                    key={route.path}
                                                                    label={<Text size="sm" fw={location.pathname === route.path ? 600 : 500}>{route.name}</Text>}
                                                                    leftSection={<Text size="sm" c={location.pathname === route.path ? drive.color : 'dimmed'}>{route.icon}</Text>}
                                                                    active={location.pathname === route.path}
                                                                    onClick={() => {
                                                                        navigate(route.path);
                                                                        toggleMobile();
                                                                    }}
                                                                    style={{ borderRadius: '8px', marginBottom: '2px', transition: 'all 0.2s', background: location.pathname === route.path ? (colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent' }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    );
                                                })
                                                : driveRoutes.map((route) => (
                                                    <NavLink
                                                        key={route.path}
                                                        label={<Text size="sm" fw={location.pathname === route.path ? 600 : 500}>{route.name}</Text>}
                                                        leftSection={<Text size="sm" c={location.pathname === route.path ? drive.color : 'dimmed'}>{route.icon}</Text>}
                                                        active={location.pathname === route.path}
                                                        onClick={() => {
                                                            navigate(route.path);
                                                            toggleMobile();
                                                        }}
                                                        style={{ borderRadius: '8px', marginBottom: '2px', transition: 'all 0.2s', background: location.pathname === route.path ? (colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent' }}
                                                    />
                                                ))}
                                        </NavLink>
                                    );
                                })}
                            </Box>
                        </AppShell.Section>
                    </Box>
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
                <AppShell.Footer withBorder={false} style={{ background: 'transparent' }}>
                    <Center h="100%" pb="md">
                        <Group
                            justify="center"
                            gap="sm"
                            className="dock-container"
                            style={{
                                background: colorScheme === 'dark' ? 'rgba(20, 20, 25, 0.75)' : 'rgba(255, 255, 255, 0.75)',
                                backdropFilter: 'blur(32px)',
                                border: colorScheme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.5)',
                                borderRadius: '24px',
                                padding: '8px 16px',
                                boxShadow: colorScheme === 'dark' ? '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 10px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
                            }}
                        >
                            {dockItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.path) && (item.path !== '/work' || location.pathname === '/work');
                                return (
                                    <Tooltip key={item.path} label={item.label} position="top" withArrow transitionProps={{ transition: 'pop', duration: 200 }}>
                                        <Box className="dock-item-wrapper" pos="relative">
                                            <ActionIcon
                                                variant={isActive ? 'filled' : 'subtle'}
                                                color={isActive ? 'blue' : 'gray'}
                                                size={48}
                                                radius="xl"
                                                onClick={() => {
                                                    navigate(item.path);
                                                    toggleMobile();
                                                }}
                                                style={{
                                                    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                                                }}
                                                className={`dock-item ${isActive ? 'active' : ''}`}
                                            >
                                                {item.icon}
                                            </ActionIcon>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="dock-indicator"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: -6,
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        background: 'var(--mantine-color-blue-5)'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                            <Divider orientation="vertical" mx="xs" color={colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
                            <Tooltip label="Search" position="top" withArrow transitionProps={{ transition: 'pop', duration: 200 }}>
                                <Box className="dock-item-wrapper">
                                    <ActionIcon
                                        variant="subtle"
                                        size={48}
                                        radius="xl"
                                        onClick={() => useAppStore.getState().setSearchOpen(true)}
                                        className="dock-item"
                                    >
                                        <IconSearch size={22} />
                                    </ActionIcon>
                                </Box>
                            </Tooltip>
                        </Group>
                    </Center>
                </AppShell.Footer>
            </AppShell>
        </>
    );
}
