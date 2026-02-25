/**
 * TagList — Mantine Badge group for skills/tech tags
 */

import { Group, Badge, type MantineColor } from '@mantine/core';

interface TagListProps {
    tags: string[];
    color?: MantineColor;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'filled' | 'light' | 'outline' | 'dot';
}

const TAG_COLORS: MantineColor[] = [
    'blue', 'violet', 'grape', 'pink', 'red',
    'orange', 'yellow', 'lime', 'green', 'teal',
    'cyan', 'indigo',
];

export function TagList({
    tags,
    color,
    size = 'sm',
    variant = 'light',
}: TagListProps) {
    return (
        <Group gap={6}>
            {tags.map((tag, i) => (
                <Badge
                    key={tag}
                    color={color ?? TAG_COLORS[i % TAG_COLORS.length]}
                    variant={variant}
                    size={size}
                >
                    {tag}
                </Badge>
            ))}
        </Group>
    );
}
