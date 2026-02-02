/**
 * Project Me - Utility Services
 * API integrations for Weather, Lanyard, UptimeRobot, Unsplash
 */

import { CONFIG } from '../config';

// Types
export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    global_name: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: { start?: number; end?: number };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }>;
  listening_to_spotify: boolean;
  spotify?: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    timestamps: { start: number; end: number };
  };
}

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  likes: number;
  views: number;
  downloads: number;
}

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWithCache<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data as T;
}

// Weather codes to descriptions and icons
const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '🌨️' },
  80: { description: 'Slight showers', icon: '🌦️' },
  81: { description: 'Moderate showers', icon: '🌦️' },
  82: { description: 'Violent showers', icon: '🌦️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export function getWeatherDescription(code: number): { description: string; icon: string } {
  return WEATHER_CODES[code] || { description: 'Unknown', icon: '❓' };
}

// Open-Meteo API (free, no API key required)
export async function getWeather(): Promise<WeatherData> {
  const { latitude, longitude } = CONFIG.location;
  const url = `${CONFIG.api.openMeteo}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  return fetchWithCache<WeatherData>(url);
}

export interface FormattedWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  isDay: boolean;
  windSpeed: number;
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    icon: string;
    precipitationChance: number;
  }>;
}

export async function getFormattedWeather(): Promise<FormattedWeather> {
  const data = await getWeather();
  const current = data.current;
  const weatherInfo = getWeatherDescription(current.weather_code);

  return {
    location: CONFIG.location.name,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    description: weatherInfo.description,
    icon: weatherInfo.icon,
    isDay: current.is_day === 1,
    windSpeed: Math.round(current.wind_speed_10m),
    forecast: data.daily.time.slice(0, 5).map((date, i) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      icon: getWeatherDescription(data.daily.weather_code[i]).icon,
      precipitationChance: data.daily.precipitation_probability_max[i],
    })),
  };
}

// Lanyard API (Discord status)
export async function getLanyardData(): Promise<LanyardData> {
  const url = `${CONFIG.api.lanyard}/${CONFIG.user.discordId}`;
  const data = await fetchWithCache<{ data: LanyardData }>(url);
  return data.data;
}

export async function getDiscordStatus(): Promise<{
  status: string;
  statusColor: string;
  activity: string | null;
  spotify: LanyardData['spotify'] | null;
}> {
  try {
    const data = await getLanyardData();

    const statusColors: Record<string, string> = {
      online: '#34C759',
      idle: '#FF9500',
      dnd: '#FF3B30',
      offline: '#8E8E93',
    };

    let activity: string | null = null;
    if (data.activities.length > 0) {
      const primaryActivity = data.activities.find(a => a.type !== 4); // Exclude custom status
      if (primaryActivity) {
        activity = primaryActivity.name;
        if (primaryActivity.details) {
          activity += `: ${primaryActivity.details}`;
        }
      }
    }

    return {
      status: data.discord_status,
      statusColor: statusColors[data.discord_status] || statusColors.offline,
      activity,
      spotify: data.listening_to_spotify ? data.spotify || null : null,
    };
  } catch {
    return {
      status: 'offline',
      statusColor: '#8E8E93',
      activity: null,
      spotify: null,
    };
  }
}

// Unsplash API
export async function getUnsplashPhotos(perPage = 10): Promise<UnsplashPhoto[]> {
  const clientId = CONFIG.keys.unsplashClientId;
  if (!clientId) {
    console.warn('Unsplash client ID not configured');
    return [];
  }

  const url = `${CONFIG.api.unsplash}/${CONFIG.user.unsplash}/photos?per_page=${perPage}&client_id=${clientId}`;
  return fetchWithCache<UnsplashPhoto[]>(url);
}

// Time utilities
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getLocalTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getLocalDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format numbers
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format duration
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

// Format relative time
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

export default {
  getWeather,
  getFormattedWeather,
  getWeatherDescription,
  getLanyardData,
  getDiscordStatus,
  getUnsplashPhotos,
  getGreeting,
  getLocalTime,
  getLocalDate,
  formatNumber,
  formatDuration,
  formatRelativeTime,
};
