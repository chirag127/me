/**
 * LoadingSpinner, ErrorBoundary, EmptyState
 * Utility UI components
 */

import { type ReactNode, Component, type ErrorInfo } from 'react';
import {
    Center,
    Loader,
    Stack,
    Title,
    Text,
    Button,
    Alert,
} from '@mantine/core';
import {
    IconAlertTriangle,
    IconMoodEmpty,
} from '@tabler/icons-react';

/* ═══ LoadingSpinner ═══ */
export function LoadingSpinner({
    label,
}: {
    label?: string;
}) {
    return (
        <Center h="40vh">
            <Stack align="center" gap="sm">
                <Loader size="lg" type="dots" />
                {label && (
                    <Text c="dimmed" size="sm">
                        {label}
                    </Text>
                )}
            </Stack>
        </Center>
    );
}

/* ═══ EmptyState ═══ */
export function EmptyState({
    title = 'No data yet',
    message = 'Check back later.',
    icon,
}: {
    title?: string;
    message?: string;
    icon?: ReactNode;
}) {
    return (
        <Center h="30vh">
            <Stack align="center" gap="sm">
                {icon ?? <IconMoodEmpty size={48} opacity={0.3} />}
                <Title order={4} c="dimmed">
                    {title}
                </Title>
                <Text c="dimmed" size="sm">
                    {message}
                </Text>
            </Stack>
        </Center>
    );
}

/* ═══ ErrorBoundary ═══ */
interface EBProps {
    children: ReactNode;
}
interface EBState {
    error: Error | null;
}

export class ErrorBoundary extends Component<
    EBProps,
    EBState
> {
    constructor(props: EBProps) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): EBState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <Center h="40vh">
                    <Alert
                        icon={<IconAlertTriangle size={20} />}
                        title="Something went wrong"
                        color="red"
                        variant="light"
                        radius="lg"
                        maw={500}
                    >
                        <Text size="sm" mb="sm">
                            {this.state.error.message}
                        </Text>
                        <Button
                            size="xs"
                            variant="outline"
                            color="red"
                            onClick={() =>
                                this.setState({ error: null })
                            }
                        >
                            Try again
                        </Button>
                    </Alert>
                </Center>
            );
        }
        return this.props.children;
    }
}
