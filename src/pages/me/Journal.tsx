/**
 * Journal — Admin-only entry form
 * All fields stored in Firebase Firestore
 * @module pages/me/Journal
 */
import {
  Container,
  TextInput,
  Textarea,
  Button,
  Group,
  Text,
  Stack,
  Select,
  SegmentedControl,
  Loader,
} from '@mantine/core';
import {
  IconSend,
  IconLock,
  IconLogout,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';
import { useAuth } from '@hooks/useAuth';
import {
  addJournalEntry,
  MOOD_MAP,
  NEXT_ACTION_OPTIONS,
  TIME_ESTIMATE_OPTIONS,
  FIELD_LABELS,
} from '@services/journal';

/* ── Mood segmented-control data ──────────── */
const MOOD_DATA = Object.entries(MOOD_MAP).map(
  ([k, v]) => ({
    value: k,
    label: `${v.emoji} ${v.label}`,
  }),
);

/* ── Next action select data ──────────────── */
const NEXT_ACTION_DATA = NEXT_ACTION_OPTIONS.map(
  (o) => ({ value: o, label: o }),
);

/* ── Time estimate select data ────────────── */
const TIME_EST_DATA = TIME_ESTIMATE_OPTIONS.map(
  (o) => ({
    value: String(o.value),
    label: o.label,
  }),
);

/* ── Initial form state ───────────────────── */
interface FormState {
  title: string;
  description: string;
  mood: string;
  doing: string;
  done: string;
  willDo: string;
  nextAction: string;
  timeEstimate: string;
}

const INITIAL: FormState = {
  title: '',
  description: '',
  mood: '',
  doing: '',
  done: '',
  willDo: '',
  nextAction: '',
  timeEstimate: '',
};

export default function Journal() {
  usePageMeta({
    title: 'Journal',
    description: 'Write thoughts & reflections',
  });

  const {
    user,
    isAdminByEmail,
    loading,
    signIn,
    signOut,
  } = useAuth();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  /* ── Helpers ────────────── */
  const set = (
    key: keyof FormState,
    val: string,
  ) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await addJournalEntry({
        t: form.title || undefined,
        d: form.description || undefined,
        m: form.mood
          ? Number(form.mood)
          : undefined,
        g: form.doing || undefined,
        h: form.done || undefined,
        w: form.willDo || undefined,
        n: form.nextAction || undefined,
        e: form.timeEstimate
          ? Number(form.timeEstimate)
          : undefined,
      });
      notifications.show({
        title: 'Published',
        message: 'Journal entry saved!',
        icon: <IconCheck size={16} />,
        color: 'green',
      });
      setForm(INITIAL);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message:
          err instanceof Error
            ? err.message
            : 'Failed to save entry',
        icon: <IconX size={16} />,
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading state ────── */
  if (loading) {
    return (
      <Container size="xl" py="xl">
        <PageHeader
          title="Journal"
          description="Write thoughts & reflections"
          breadcrumb={['Me', 'Journal', 'Write']}
        />
        <GlassCard>
          <Stack align="center" py="xl">
            <Loader size="md" />
          </Stack>
        </GlassCard>
      </Container>
    );
  }

  /* ── Not signed in ────── */
  if (!user) {
    return (
      <Container size="xl" py="xl">
        <PageHeader
          title="Journal"
          description="Write thoughts & reflections"
          breadcrumb={['Me', 'Journal', 'Write']}
        />
        <GlassCard>
          <Stack align="center" gap="md" py="xl">
            <IconLock size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              Admin sign-in required
            </Text>
            <Button
              variant="gradient"
              gradient={{
                from: '#007AFF',
                to: '#5856D6',
              }}
              onClick={signIn}
            >
              Sign in with Google
            </Button>
          </Stack>
        </GlassCard>
      </Container>
    );
  }

  /* ── Signed in but not admin ── */
  if (!isAdminByEmail) {
    return (
      <Container size="xl" py="xl">
        <PageHeader
          title="Journal"
          description="Write thoughts & reflections"
          breadcrumb={['Me', 'Journal', 'Write']}
        />
        <GlassCard>
          <Stack align="center" gap="md" py="xl">
            <IconLock size={48} opacity={0.3} />
            <Text c="dimmed" ta="center">
              Access denied —
              only the admin can write entries.
            </Text>
            <Button
              variant="subtle"
              color="gray"
              leftSection={
                <IconLogout size={14} />
              }
              onClick={signOut}
            >
              Sign out
            </Button>
          </Stack>
        </GlassCard>
      </Container>
    );
  }

  /* ── Admin form ───────── */
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Journal"
        description="Write thoughts & reflections"
        breadcrumb={['Me', 'Journal', 'Write']}
      />

      <GlassCard>
        <Stack gap="md">
          {/* Title */}
          <TextInput
            label={FIELD_LABELS.t}
            placeholder="Entry title…"
            value={form.title}
            onChange={(e) =>
              set('title', e.currentTarget.value)
            }
          />

          {/* Description */}
          <Textarea
            label={FIELD_LABELS.d}
            placeholder="What's on your mind…"
            minRows={4}
            autosize
            value={form.description}
            onChange={(e) =>
              set(
                'description',
                e.currentTarget.value,
              )
            }
          />

          {/* Mood */}
          <div>
            <Text size="sm" fw={500} mb={4}>
              {FIELD_LABELS.m}
            </Text>
            <SegmentedControl
              fullWidth
              data={MOOD_DATA}
              value={form.mood}
              onChange={(v) => set('mood', v)}
              color="blue"
            />
          </div>

          {/* What I Am Doing */}
          <Textarea
            label={FIELD_LABELS.g}
            placeholder="Currently working on…"
            minRows={2}
            autosize
            value={form.doing}
            onChange={(e) =>
              set('doing', e.currentTarget.value)
            }
          />

          {/* What I Have Done Today */}
          <Textarea
            label={FIELD_LABELS.h}
            placeholder="Accomplished today…"
            minRows={2}
            autosize
            value={form.done}
            onChange={(e) =>
              set('done', e.currentTarget.value)
            }
          />

          {/* What I Will Do */}
          <Textarea
            label={FIELD_LABELS.w}
            placeholder="Planning to do…"
            minRows={2}
            autosize
            value={form.willDo}
            onChange={(e) =>
              set('willDo', e.currentTarget.value)
            }
          />

          {/* Next Action (dropdown) */}
          <Select
            label={FIELD_LABELS.n}
            placeholder="When will you do it?"
            data={NEXT_ACTION_DATA}
            value={form.nextAction || null}
            onChange={(v) =>
              set('nextAction', v || '')
            }
            clearable
          />

          {/* Time Estimate (dropdown) */}
          <Select
            label={FIELD_LABELS.e}
            placeholder="How long will it take?"
            data={TIME_EST_DATA}
            value={form.timeEstimate || null}
            onChange={(v) =>
              set('timeEstimate', v || '')
            }
            clearable
          />

          {/* Submit */}
          <Group justify="space-between" mt="md">
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Signed in as{' '}
                {user.email}
              </Text>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                leftSection={
                  <IconLogout size={12} />
                }
                onClick={signOut}
              >
                Sign out
              </Button>
            </Group>
            <Button
              leftSection={
                <IconSend size={14} />
              }
              variant="gradient"
              gradient={{
                from: '#007AFF',
                to: '#5856D6',
              }}
              onClick={handleSubmit}
              loading={submitting}
            >
              Publish
            </Button>
          </Group>
        </Stack>
      </GlassCard>
    </Container>
  );
}
