/**
 * ChartCard — Wrapper for @mantine/charts with glass bg
 */

import { Text, Skeleton, Stack } from '@mantine/core';
import { GlassCard } from './GlassCard';
import { type ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    children: ReactNode;
    height?: number;
}

export function ChartCard({
    title,
    subtitle,
    loading = false,
    children,
    height = 300,
}: ChartCardProps) {
    return (
        <GlassCard>
            <Stack gap="xs" mb="sm">
                <Text fw={600} size="sm">
                    {title}
                </Text>
                {subtitle && (
                    <Text c="dimmed" size="xs">
                        {subtitle}
                    </Text>
                )}
            </Stack>
            {loading ? (
                <Skeleton height={height} radius="md" animate />
            ) : (
                <div style={{ height, width: '100%' }}>
                    {children}
                </div>
            )}
        </GlassCard>
    );
}
