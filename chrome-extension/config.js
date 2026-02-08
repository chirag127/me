/**
 * LifeLogger - Configuration
 */

export const CONFIG = {
  // Your email for write access
  AUTHORIZED_EMAIL: 'chiragsinghal127@gmail.com',

  // API endpoints (Google Sheets Apps Script)
  API_BASE_URL: 'https://script.google.com/macros/s/AKfycby1Bvb7jjn6GYlL-ESEMjEi2yiU0R0B30yuUmxz_WKYLDlaFYX4EGObFvLFnwf3m44BtA/exec', // Set after deploying Apps Script

  // Screenshot services
  CLOUDINARY: {
    CLOUD_NAME: 'didm1uuj4',
    UPLOAD_PRESET: 'project-me' // Create unsigned preset in Cloudinary Settings → Upload → Upload Presets
  },

  IMGBB: {
    API_KEY: '' // Fallback service
  },

  // Capture settings
  SCREENSHOT_DELAY_MS: 2000, // Wait before capture
  SCREENSHOT_WIDTH: 640, // Thumbnail width

  // Search engines to track
  SEARCH_ENGINES: [
    { name: 'Google', pattern: /google\.\w+\/search/, param: 'q' },
    { name: 'Bing', pattern: /bing\.com\/search/, param: 'q' },
    { name: 'DuckDuckGo', pattern: /duckduckgo\.com/, param: 'q' },
    { name: 'YouTube', pattern: /youtube\.com\/results/, param: 'search_query' },
    { name: 'Amazon', pattern: /amazon\.\w+\/s/, param: 'k' },
    { name: 'GitHub', pattern: /github\.com\/search/, param: 'q' },
    { name: 'StackOverflow', pattern: /stackoverflow\.com\/search/, param: 'q' },
    { name: 'Reddit', pattern: /reddit\.com\/search/, param: 'q' },
    { name: 'Twitter', pattern: /x\.com\/search/, param: 'q' }
  ],

  // Domains to NEVER screenshot (security)
  BLOCKED_DOMAINS: [
    // Banking
    'bank', 'banking', 'netbanking', 'onlinebanking',
    'paypal.com', 'razorpay.com', 'stripe.com',

    // Auth & Login
    'accounts.google.com', 'login.', 'signin', 'auth',
    'oauth', 'sso.', 'id.', 'identity.',

    // Password managers
    '1password.com', 'lastpass.com', 'bitwarden.com', 'dashlane.com',

    // Email
    'mail.google.com', 'outlook.', 'mail.yahoo',

    // Sensitive
    '.gov.', 'password', 'secret', 'private',
    'healthcare', 'medical', 'health.',

    // Your own auth pages
    'chirag127.in/auth', 'chirag127.in/login'
  ],

  // Video platforms (to supplement Web Scrobbler)
  VIDEO_PLATFORMS: [
    { name: 'Generic', pattern: /.*/,  selector: 'video' }
  ],

  // Platforms already handled by other scrobblers (skip these)
  SKIP_PLATFORMS: [
    'youtube.com', // Web Scrobbler
    'netflix.com', // Universal Trakt Scrobbler
    'primevideo.com',
    'hotstar.com',
    'spotify.com',
    'music.youtube.com'
  ]
};

export default CONFIG;
