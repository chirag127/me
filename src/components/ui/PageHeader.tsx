/**
 * PageHeader — Title + description + breadcrumbs
 */

import {
    Title,
    Text,
    Breadcrumbs,
    Anchor,
    Group,
    Badge,
} from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumb?: string[];
    isPrivate?: boolean;
}

export function PageHeader({
    title,
    description,
    breadcrumb,
    isPrivate,
}: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            {breadcrumb && breadcrumb.length > 0 && (
                <Breadcrumbs
                    mb="xs"
                    styles={{
                        separator: { opacity: 0.4 },
                    }}
                >
                    {breadcrumb.map((item, i) => (
                        <Anchor
                            key={item}
                            size="sm"
                            c={
                                i === breadcrumb.length - 1
                                    ? undefined
                                    : 'dimmed'
                            }
                            onClick={() => {
                                if (i === 0) {
                                    navigate(
                                        `/${item.toLowerCase()}`
                                    );
                                }
                            }}
                            style={{
                                cursor:
                                    i === breadcrumb.length - 1
                                        ? 'default'
                                        : 'pointer',
                            }}
                        >
                            {item}
                        </Anchor>
                    ))}
                </Breadcrumbs>
            )}

            <Group gap="sm" align="center">
                <Title order={1} className="gradient-text">
                    {title}
                </Title>
                {isPrivate && (
                    <Badge
                        leftSection={<IconLock size={12} />}
                        variant="outline"
                        color="red"
                        size="sm"
                    >
                        Private
                    </Badge>
                )}
            </Group>

            {description && (
                <Text c="dimmed" mt={4} size="sm" maw={600}>
                    {description}
                </Text>
            )}
        </div>
    );
}
