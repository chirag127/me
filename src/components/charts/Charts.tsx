/**
 * Chart card wrappers — pre-styled @mantine/charts
 * Each exports a ready-to-use chart inside ChartCard
 */

import {
    AreaChart as MAreaChart,
    BarChart as MBarChart,
    DonutChart as MDonutChart,
    RadarChart as MRadarChart,
    type AreaChartProps,
    type BarChartProps,
    type DonutChartProps,
    type RadarChartProps,
} from '@mantine/charts';
import { ChartCard } from '@components/ui/ChartCard';

/* ═══ Area ═══ */
interface AreaChartCardProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    data: AreaChartProps['data'];
    dataKey: string;
    series: AreaChartProps['series'];
}

export function AreaChartCard({
    title,
    subtitle,
    loading,
    height = 280,
    data,
    dataKey,
    series,
}: AreaChartCardProps) {
    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            loading={loading}
            height={height}
        >
            <MAreaChart
                h={height}
                data={data}
                dataKey={dataKey}
                series={series}
                curveType="natural"
                gridAxis="xy"
                withDots={false}
                fillOpacity={0.15}
                strokeWidth={2}
            />
        </ChartCard>
    );
}

/* ═══ Bar ═══ */
interface BarChartCardProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    data: BarChartProps['data'];
    dataKey: string;
    series: BarChartProps['series'];
    orientation?: 'vertical' | 'horizontal';
}

export function BarChartCard({
    title,
    subtitle,
    loading,
    height = 280,
    data,
    dataKey,
    series,
    orientation = 'vertical',
}: BarChartCardProps) {
    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            loading={loading}
            height={height}
        >
            <MBarChart
                h={height}
                data={data}
                dataKey={dataKey}
                series={series}
                orientation={orientation}
                gridAxis="xy"
            />
        </ChartCard>
    );
}

/* ═══ Donut/Pie ═══ */
interface PieChartCardProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    data: DonutChartProps['data'];
    withLabels?: boolean;
}

export function PieChartCard({
    title,
    subtitle,
    loading,
    height = 280,
    data,
    withLabels = true,
}: PieChartCardProps) {
    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            loading={loading}
            height={height}
        >
            <MDonutChart
                data={data}
                withLabelsLine={withLabels}
                withLabels={withLabels}
                size={Math.min(height - 20, 240)}
                thickness={24}
                paddingAngle={2}
                mx="auto"
            />
        </ChartCard>
    );
}

/* ═══ Radar ═══ */
interface RadarChartCardProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    height?: number;
    data: RadarChartProps['data'];
    dataKey: string;
    series: RadarChartProps['series'];
}

export function RadarChartCard({
    title,
    subtitle,
    loading,
    height = 280,
    data,
    dataKey,
    series,
}: RadarChartCardProps) {
    return (
        <ChartCard
            title={title}
            subtitle={subtitle}
            loading={loading}
            height={height}
        >
            <MRadarChart
                h={height}
                data={data}
                dataKey={dataKey}
                series={series}
                withPolarGrid
                withPolarAngleAxis
                withPolarRadiusAxis
            />
        </ChartCard>
    );
}
