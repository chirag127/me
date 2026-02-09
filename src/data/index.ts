/**
 * Data Module Index - Re-exports all data modules
 * Single import point for all data
 */

// Identity & Personal
export { IDENTITY, type Identity, type Usernames } from './identity';
export { SOCIAL, getLinksByCategory, type SocialLink, type SocialLinks } from './social';

// Professional
export { RESUME, type Resume, type PersonalInfo, type Experience, type Project, type Education } from './resume';

// Life Data
export { GEAR, getCurrentGear, getGearHistory, type GearItem, type GearCategory } from './gear';
export {
    MILESTONES,
    getOnThisDay,
    getMilestonesByCategory,
    getMilestonesByYear,
    getRecentMilestones,
    type Milestone
} from './milestones';
export {
    PURCHASES,
    getPurchasesByCategory,
    getPurchasesByYear,
    getDeliveredPurchases,
    getTotalSpent,
    getSpendingByCategory,
    getRecentPurchases,
    type Purchase
} from './purchases';

// Configuration
export { API_ENDPOINTS, API_KEYS, LOCATION, type ApiEndpoints, type ApiKeys, type LocationConfig } from './api-config';

// History
export { historyManager } from './history';
export type { HistoryEntry, HistoryMetadata, HistoryKey } from './history';

// Re-export store
export { store } from './store';
