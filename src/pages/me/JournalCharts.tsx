/**
 * JournalCharts — Analytics dashboard
 * Fetches all entries, computes stats, charts via recharts
 * @module pages/me/JournalCharts
 */
import {
  Container,
  Text,
  Stack,
  SimpleGrid,
  Loader,
} from '@mantine/core';
import {
  IconChartBar,
  IconFlame,
  IconPencil,
  IconCalendar,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import {
  getAllJournalEntries,
  computeStats,
  MOOD_MAP,
  DAYS,
  type JournalStats,
} from '@services/journal';

/* ── Stat Card ───────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <GlassCard>
      <Stack align="center" gap={4}>
        <div style={{ color, opacity: 0.8 }}>
          {icon}
        </div>
        <Text fw={700} size="xl">
          {value}
        </Text>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
      </Stack>
    </GlassCard>
  );
}

/* ── Chart wrapper ───────────────────────── */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard>
      <Text fw={600} mb="sm">
        {title}
      </Text>
      <div style={{ width: '100%', height: 250 }}>
        {children}
      </div>
    </GlassCard>
  );
}



export default function JournalCharts() {
  usePageMeta({
    title: 'Journal Analytics',
    description: 'Writing analytics',
  });

  const [stats, setStats] =
    useState<JournalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries =
        await getAllJournalEntries();
      if (!cancelled) {
        setStats(computeStats(entries));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <PageHeader
          title="Journal Analytics"
          description="Writing analytics"
          breadcrumb={[
            'Me',
            'Journal',
            'Analytics',
          ]}
        />
        <GlassCard>
          <Stack align="center" py="xl">
            <Loader size="md" />
          </Stack>
        </GlassCard>
      </Container>
    );
  }

  if (!stats || stats.totalEntries === 0) {
    return (
      <Container size="xl" py="xl">
        <PageHeader
          title="Journal Analytics"
          description="Writing analytics"
          breadcrumb={[
            'Me',
            'Journal',
            'Analytics',
          ]}
        />
        <GlassCard>
          <Stack
            align="center"
            gap="md"
            py="xl"
          >
            <IconChartBar
              size={48}
              opacity={0.3}
            />
            <Text fw={600}>
              No journal entries yet
            </Text>
            <Text
              size="sm"
              c="dimmed"
              ta="center"
              maw={400}
            >
              Analytics will appear here once
              journal entries exist.
            </Text>
          </Stack>
        </GlassCard>
      </Container>
    );
  }

  /* ── Prepare chart data ── */
  const moodPieData = Object.entries(
    stats.moodCounts,
  ).map(([k, v]) => ({
    name:
      MOOD_MAP[Number(k)]?.label ?? `Mood ${k}`,
    value: v,
    color:
      MOOD_MAP[Number(k)]?.color ?? '#8E8E93',
  }));

  const dowData = stats.entriesByDayOfWeek.map(
    (count, i) => ({
      day: DAYS[i],
      entries: count,
    }),
  );

  const hourData = stats.entriesByHour.map(
    (count, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      entries: count,
    }),
  );

  const monthData = Object.entries(
    stats.entriesByMonth,
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      entries: count,
    }));

  const moodTimeline = stats.moodByDate
    .slice()
    .sort((a, b) =>
      a.date.localeCompare(b.date),
    )
    .map((m) => ({
      date: m.date,
      mood: m.mood,
      label:
        MOOD_MAP[m.mood]?.label ?? String(m.mood),
    }));

  const wordData = stats.wordCounts.map(
    (wc, i) => ({
      entry: i + 1,
      words: wc,
    }),
  );

  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal Analytics"
        description="Writing analytics"
        breadcrumb={[
          'Me',
          'Journal',
          'Analytics',
        ]}
      />

      {/* ── Stat Cards ─── */}
      <SimpleGrid
        cols={{ base: 1, sm: 3 }}
        mb="xl"
      >
        <StatCard
          icon={<IconPencil size={28} />}
          label="Total Entries"
          value={stats.totalEntries}
          color="#007AFF"
        />
        <StatCard
          icon={<IconFlame size={28} />}
          label="Current Streak"
          value={`${stats.streaks.current}d`}
          color="#FF9500"
        />
        <StatCard
          icon={<IconCalendar size={28} />}
          label="Longest Streak"
          value={`${stats.streaks.longest}d`}
          color="#34C759"
        />
      </SimpleGrid>

      {/* ── Charts ─────── */}
      <SimpleGrid
        cols={{ base: 1, md: 2 }}
        spacing="lg"
      >
        {/* Mood Distribution */}
        {moodPieData.length > 0 && (
          <ChartCard title="Mood Distribution">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={moodPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {moodPieData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Entries by Day of Week */}
        <ChartCard title="Entries by Day">
          <ResponsiveContainer>
            <BarChart data={dowData}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.2}
              />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="entries"
                fill="#5856D6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Entries by Hour */}
        <ChartCard title="Entries by Hour">
          <ResponsiveContainer>
            <AreaChart data={hourData}>
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.2}
              />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="entries"
                stroke="#007AFF"
                fill="#007AFF"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Entries by Month */}
        {monthData.length > 0 && (
          <ChartCard title="Entries by Month">
            <ResponsiveContainer>
              <BarChart data={monthData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis dataKey="month" />
                <YAxis
                  allowDecimals={false}
                />
                <Tooltip />
                <Bar
                  dataKey="entries"
                  fill="#34C759"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Mood Over Time */}
        {moodTimeline.length > 0 && (
          <ChartCard title="Mood Over Time">
            <ResponsiveContainer>
              <LineChart data={moodTimeline}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[0, 5]}
                  allowDecimals={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#FF9500"
                  strokeWidth={2}
                  dot={{ fill: '#FF9500' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Word Count Distribution */}
        {wordData.length > 0 && (
          <ChartCard title="Word Counts">
            <ResponsiveContainer>
              <BarChart data={wordData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />
                <XAxis dataKey="entry" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="words"
                  fill="#FF3B30"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </SimpleGrid>
    </Container>
  );
}
