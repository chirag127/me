export interface SocialLink {
  name: string;
  url: string;
  icon: string; // SVG path or icon name
  color: string;
  username: string;
}

export const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/chirag127", icon: "github", color: "#f0f6fc", username: "chirag127" },
  { name: "LinkedIn", url: "https://linkedin.com/in/chirag127", icon: "linkedin", color: "#0a66c2", username: "chirag127" },
  { name: "Dev.to", url: "https://dev.to/chirag127", icon: "devto", color: "#0a0a0a", username: "chirag127" },
  { name: "Bluesky", url: "https://bsky.app/profile/chirag127.bsky.social", icon: "bluesky", color: "#0085ff", username: "chirag127.bsky.social" },
  { name: "Mastodon", url: "https://mastodon.social/@chirag127", icon: "mastodon", color: "#6364ff", username: "@chirag127" },
  { name: "Reddit", url: "https://reddit.com/user/chirag127", icon: "reddit", color: "#ff4500", username: "u/chirag127" },
  { name: "LeetCode", url: "https://leetcode.com/chirag127", icon: "leetcode", color: "#ffa116", username: "chirag127" },
  { name: "Codewars", url: "https://codewars.com/users/chirag127", icon: "codewars", color: "#b1361e", username: "chirag127" },
  { name: "Lichess", url: "https://lichess.org/@/chirag127", icon: "lichess", color: "#ffffff", username: "chirag127" },
  { name: "Last.fm", url: "https://last.fm/user/lastfmwhy", icon: "lastfm", color: "#d51007", username: "lastfmwhy" },
  { name: "AniList", url: "https://anilist.co/user/chirag127", icon: "anilist", color: "#02a9ff", username: "chirag127" },
  { name: "Letterboxd", url: "https://letterboxd.com/chirag127", icon: "letterboxd", color: "#00e054", username: "chirag127" },
  { name: "Email", url: "mailto:hi@chirag127.in", icon: "mail", color: "#6366f1", username: "hi@chirag127.in" },
];
