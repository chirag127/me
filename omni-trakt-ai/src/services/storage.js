/**
 * @file Chrome Storage helper service
 * Wraps chrome.storage.local with async/await patterns
 */

const StorageKeys = Object.freeze({
    TRAKT_TOKEN: 'trakt_token',
    TRAKT_REFRESH_TOKEN: 'trakt_refresh_token',
    TRAKT_TOKEN_EXPIRY: 'trakt_token_expiry',
    TRAKT_USER: 'trakt_user',
    TRAKT_CLIENT_ID: 'trakt_client_id',
    TRAKT_CLIENT_SECRET: 'trakt_client_secret',
    GEMINI_API_KEY: 'gemini_api_key',
    SCROBBLE_HISTORY: 'scrobble_history',
    LOCAL_HISTORY: 'local_history',
    SETTINGS: 'settings',
});

/**
 * Get a value from chrome.storage.local
 * @param {string} key
 * @returns {Promise<any>}
 */
async function storageGet(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key] ?? null);
        });
    });
}

/**
 * Set a value in chrome.storage.local
 * @param {string} key
 * @param {any} value
 * @returns {Promise<void>}
 */
async function storageSet(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

/**
 * Remove a key from chrome.storage.local
 * @param {string} key
 * @returns {Promise<void>}
 */
async function storageRemove(key) {
    return new Promise((resolve) => {
        chrome.storage.local.remove([key], resolve);
    });
}

/**
 * Get multiple values at once
 * @param {string[]} keys
 * @returns {Promise<Object>}
 */
async function storageGetMultiple(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => {
            resolve(result);
        });
    });
}

/**
 * Append an item to an array stored in chrome.storage.local (max 100 items)
 * @param {string} key
 * @param {any} item
 * @param {number} maxItems
 * @returns {Promise<void>}
 */
async function storageAppendToList(key, item, maxItems = 100) {
    const list = (await storageGet(key)) || [];
    list.unshift(item);
    if (list.length > maxItems) list.length = maxItems;
    await storageSet(key, list);
}
