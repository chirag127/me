import { fetchJson } from './fetcher';
import { CONFIG } from '../config';

export async function fetchMastodonStatuses(limit = 20) {
  const server = CONFIG.user.mastodon.server;
  const accountId = CONFIG.user.mastodon.id;

  const data = await fetchJson<any[]>(
    `https://${server}/api/v1/accounts/${accountId}/statuses?limit=${limit}&exclude_replies=true&exclude_reblogs=true`,
    undefined,
    'Mastodon'
  );

  if (!data) return [];

  return data.map((status: any) => ({
    id: status.id,
    content: status.content,
    createdAt: status.created_at,
    url: status.url,
    repliesCount: status.replies_count,
    reblogsCount: status.reblogs_count,
    favouritesCount: status.favourites_count,
    mediaAttachments: (status.media_attachments || []).map((m: any) => ({
      type: m.type,
      url: m.url,
      previewUrl: m.preview_url,
      description: m.description,
    })),
    visibility: status.visibility,
  }));
}

export async function fetchMastodonAccount() {
  const server = CONFIG.user.mastodon.server;
  const accountId = CONFIG.user.mastodon.id;

  const data = await fetchJson<any>(
    `https://${server}/api/v1/accounts/${accountId}`,
    undefined,
    'Mastodon'
  );

  if (!data) return null;

  return {
    username: data.username,
    displayName: data.display_name,
    note: data.note,
    url: data.url,
    avatar: data.avatar,
    header: data.header,
    followersCount: data.followers_count,
    followingCount: data.following_count,
    statusesCount: data.statuses_count,
    createdAt: data.created_at,
    bot: data.bot,
    fields: (data.fields || []).map((f: any) => ({
      name: f.name,
      value: f.value,
      verifiedAt: f.verified_at,
    })),
  };
}
