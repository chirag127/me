/**
 * TrendIndicator — Up/down arrow with percentage change
 */

import { Group, Text } from '@mantine/core';
import {
    IconTrendingUp,
    IconTrendingDown,
    IconMinus,
} from '@tabler/icons-react';

interface TrendIndicatorProps {
    value: number;
    label?: string;
}

export function TrendIndicator({
    value,
    label,
}: TrendIndicatorProps) {
    const isPositive = value > 0;
    const isZero = value === 0;
    const color = isZero
        ? 'dimmed'
        : isPositive
            ? 'teal'
            : 'red';
    const Icon = isZero
        ? IconMinus
        : isPositive
            ? IconTrendingUp
            : IconTrendingDown;

    return (
        <Group gap={4} align="center">
            <Icon size={14} color={`var(--mantine-color-${color}-6)`} />
            <Text size="xs" c={color} fw={500}>
                {isPositive ? '+' : ''}
                {value.toFixed(1)}%
            </Text>
            {label && (
                <Text size="xs" c="dimmed">
                    {label}
                </Text>
            )}
        </Group>
    );
}
