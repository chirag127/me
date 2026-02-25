/**
 * StatCard — Metric display with optional sparkline
 */

import { Text, Group, Stack } from '@mantine/core';
import { Sparkline } from '@mantine/charts';
import { GlassCard } from './GlassCard';
import { TrendIndicator } from '@components/charts/TrendIndicator';

interface StatCardProps {
    label: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    sparkData?: number[];
    icon?: React.ReactNode;
    color?: string;
}

export function StatCard({
    label,
    value,
    change,
    changeLabel,
    sparkData,
    icon,
    color = '#007AFF',
}: StatCardProps) {
    return (
        <GlassCard>
            <Stack gap="xs">
                <Group justify="space-between" align="flex-start">
                    <Text c="dimmed" size="xs" tt="uppercase" fw={600}>
                        {label}
                    </Text>
                    {icon && (
                        <Text size="lg" style={{ opacity: 0.6 }}>
                            {icon}
                        </Text>
                    )}
                </Group>

                <Text
                    size="xl"
                    fw={700}
                    style={{
                        fontSize: '1.75rem',
                        lineHeight: 1.1,
                    }}
                >
                    {value}
                </Text>

                {change !== undefined && (
                    <TrendIndicator
                        value={change}
                        label={changeLabel}
                    />
                )}

                {sparkData && sparkData.length > 1 && (
                    <Sparkline
                        data={sparkData}
                        w="100%"
                        h={32}
                        color={color}
                        curveType="natural"
                        fillOpacity={0.15}
                        strokeWidth={1.5}
                    />
                )}
            </Stack>
        </GlassCard>
    );
}
