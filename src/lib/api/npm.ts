import { fetchJson } from './fetcher';

const NPM_API = 'https://registry.npmjs.org';
const NPM_DOWNLOADS_API = 'https://api.npmjs.org/downloads';

interface NpmPackage {
  name: string;
  description: string;
  version: string;
  homepage: string;
  repository: { url: string };
  keywords: string[];
  license: string;
}

export async function fetchNpmPackageInfo(packageName: string) {
  const data = await fetchJson<any>(
    `${NPM_API}/${packageName}`,
    undefined,
    'NPM',
  );

  if (!data) return null;

  const latest = data['dist-tags']?.latest;
  const latestVersion = latest ? data.versions?.[latest] : null;

  return {
    name: data.name,
    description: data.description,
    version: latest,
    homepage: data.homepage || `https://www.npmjs.com/package/${data.name}`,
    repository: data.repository?.url || null,
    keywords: latestVersion?.keywords || data.keywords || [],
    license: latestVersion?.license || data.license || 'Unknown',
    time: {
      created: data.time?.created,
      modified: data.time?.modified,
      latest: data.time?.[latest],
    },
  };
}

export async function fetchNpmDownloads(
  packageName: string,
  period = 'last-month',
) {
  const data = await fetchJson<any>(
    `${NPM_DOWNLOADS_API}/point/${period}/${packageName}`,
    undefined,
    'NPM',
  );

  if (!data) return null;

  return {
    downloads: data.downloads,
    period: data.period,
    package: data.package,
  };
}

export async function fetchNpmDownloadsRange(
  packageName: string,
  period = 'last-year',
) {
  const data = await fetchJson<any>(
    `${NPM_DOWNLOADS_API}/range/${period}/${packageName}`,
    undefined,
    'NPM',
  );

  if (!data) return null;

  const totalDownloads =
    data.downdays?.reduce((sum: number, d: any) => sum + d.downloads, 0) || 0;

  return {
    totalDownloads,
    package: data.package,
    daily: (data.downloads || []).map((d: any) => ({
      date: d.day,
      downloads: d.downloads,
    })),
  };
}

export async function fetchNpmUserPackages(username: string) {
  const data = await fetchJson<any>(
    `${NPM_API}/-/v1/search?text=maintainer:${username}&size=25`,
    undefined,
    'NPM',
  );

  if (!data?.objects) return [];

  return data.objects.map((obj: any) => ({
    name: obj.package.name,
    description: obj.package.description,
    version: obj.package.version,
    keywords: obj.package.keywords || [],
    date: obj.package.date,
    links: obj.package.links,
    publisher: obj.package.publisher?.username,
  }));
}
