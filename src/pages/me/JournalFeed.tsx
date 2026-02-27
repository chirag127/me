/**
 * JournalFeed — Public paginated journal feed
 * Reads from Firebase Firestore + Puter.js KV
 * @module pages/me/JournalFeed
 */
import {
  Container,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  Loader,
  SimpleGrid,
} from '@mantine/core';
import {
  IconMoodEmpty,
  IconClock,
  IconArrowDown,
} from '@tabler/icons-react';
import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import { usePageMeta } from '@hooks/usePageMeta';
import {
  PageHeader,
} from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { usePuterAuth } from '@hooks/usePuterAuth';
import {
  getJournalEntries,
  getPuterJournalEntries,
  MOOD_MAP,
  FIELD_LABELS,
  TIME_ESTIMATE_OPTIONS,
  type JournalEntry,
  type JournalPage,
} from '@services/journal';
import { Timestamp } from 'firebase/firestore';

/* ── Helpers ────────────────────────────── */
function fmtDate(
  ts: Timestamp | unknown,
): string {
  const d =
    ts instanceof Timestamp
      ? ts.toDate()
      : new Date(ts as string);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeLabel(mins: number): string {
  const opt = TIME_ESTIMATE_OPTIONS.find(
    (o) => o.value === mins,
  );
  return opt ? opt.label : `${mins} min`;
}

/* ── Entry Card Component ─────────────── */
function EntryCard({
  entry,
}: {
  entry: JournalEntry;
}) {
  const mood =
    entry.m !== undefined
      ? MOOD_MAP[entry.m]
      : null;

  const isPuter = entry.id.startsWith('puter-');

  return (
    <GlassCard hover>
      {/* Header: Title + Date */}
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          {entry.t && (
            <Text fw={700} size="lg">
              {entry.t}
            </Text>
          )}
          {mood && (
            <Badge
              variant="light"
              color={mood.color}
              size="lg"
            >
              {mood.emoji} {mood.label}
            </Badge>
          )}
          {isPuter && (
            <Badge
              variant="dot"
              color="violet"
              size="sm"
            >
              Private
            </Badge>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          {fmtDate(entry.ts)}
        </Text>
      </Group>

      {/* Description */}
      {entry.d && (
        <Text
          size="sm"
          mb="sm"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {entry.d}
        </Text>
      )}

      {/* Activity fields */}
      <SimpleGrid
        cols={{ base: 1, sm: 3 }}
        spacing="xs"
      >
        {entry.g && (
          <FieldBadge
            label={FIELD_LABELS.g}
            text={entry.g}
            color="cyan"
          />
        )}
        {entry.h && (
          <FieldBadge
            label={FIELD_LABELS.h}
            text={entry.h}
            color="green"
          />
        )}
        {entry.w && (
          <FieldBadge
            label={FIELD_LABELS.w}
            text={entry.w}
            color="violet"
          />
        )}
      </SimpleGrid>

      {/* Bottom badges */}
      {(entry.n ||
        entry.e !== undefined) && (
          <Group gap="xs" mt="sm">
            {entry.n && (
              <Badge
                variant="outline"
                color="orange"
                size="sm"
              >
                ⏭ {entry.n}
              </Badge>
            )}
            {entry.e !== undefined && (
              <Badge
                variant="outline"
                color="blue"
                size="sm"
                leftSection={
                  <IconClock size={12} />
                }
              >
                {getTimeLabel(entry.e)}
              </Badge>
            )}
          </Group>
        )}
    </GlassCard>
  );
}

/* ── Reusable field badge ─────────────── */
function FieldBadge({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div>
      <Text
        size="xs"
        fw={600}
        c={color}
        mb={2}
      >
        {label}
      </Text>
      <Text
        size="sm"
        c="dimmed"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {text}
      </Text>
    </div>
  );
}

/* ── Main Page ────────────────────────── */
export default function JournalFeed() {
  usePageMeta({
    title: 'Journal Feed',
    description: 'Recent journal entries',
  });

  const puterAuth = usePuterAuth();

  const [entries, setEntries] = useState<
    JournalEntry[]
  >([]);
  const [page, setPage] =
    useState<JournalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] =
    useState(false);

  /* ── Initial load ──── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);

      /* Firestore entries */
      const result =
        await getJournalEntries(20);

      /* Puter.js entries */
      let puterEntries: JournalEntry[] = [];
      if (puterAuth.signedIn) {
        puterEntries =
          await getPuterJournalEntries();
      }

      if (!cancelled) {
        /* Merge: Puter first, then Firestore */
        const merged = [
          ...puterEntries,
          ...result.entries,
        ];
        setEntries(merged);
        setPage(result);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [puterAuth.signedIn]);

  /* ── Load more (Firestore only) ──── */
  const loadMore =
    useCallback(async () => {
      if (!page?.hasMore || !page.lastDoc)
        return;
      setLoadingMore(true);
      const result = await getJournalEntries(
        20,
        page.lastDoc,
      );
      setEntries((prev) => [
        ...prev,
        ...result.entries,
      ]);
      setPage(result);
      setLoadingMore(false);
    }, [page]);

  /* ── Render ──── */
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal Feed"
        description="Recent entries"
        breadcrumb={[
          'Me',
          'Journal',
          'Feed',
        ]}
      />

      {loading ? (
        <GlassCard>
          <Stack align="center" py="xl">
            <Loader size="md" />
            <Text c="dimmed" size="sm">
              Loading entries…
            </Text>
          </Stack>
        </GlassCard>
      ) : entries.length === 0 ? (
        <GlassCard>
          <Stack
            align="center"
            gap="md"
            py="xl"
          >
            <IconMoodEmpty
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
              Write your first entry on the
              Journal Write page to see it
              here.
            </Text>
          </Stack>
        </GlassCard>
      ) : (
        <Stack gap="md">
          {entries.map((e) => (
            <EntryCard
              key={e.id}
              entry={e}
            />
          ))}

          {page?.hasMore && (
            <Group justify="center" mt="md">
              <Button
                variant="light"
                leftSection={
                  <IconArrowDown size={14} />
                }
                loading={loadingMore}
                onClick={loadMore}
              >
                Load More
              </Button>
            </Group>
          )}
        </Stack>
      )}
    </Container>
  );
}
