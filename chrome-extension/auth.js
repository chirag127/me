/**
 * LifeLogger - Google OAuth Authentication
 */

import CONFIG from './config.js';

class Auth {
  constructor() {
    this.user = null;
    this.token = null;
  }

  /**
   * Sign in with Google
   */
  async signIn() {
    try {
      const token = await chrome.identity.getAuthToken({ interactive: true });

      if (token) {
        this.token = token.token;
        await this.fetchUserInfo();
        await this.saveSession();
        return { success: true, user: this.user };
      }
    } catch (error) {
      console.error('[LifeLogger] Auth error:', error);
      return { success: false, error: error.message };
    }

    return { success: false, error: 'No token received' };
  }

  /**
   * Sign out
   */
  async signOut() {
    if (this.token) {
      await chrome.identity.removeCachedAuthToken({ token: this.token });
    }

    this.user = null;
    this.token = null;
    await chrome.storage.local.remove(['user', 'token']);

    return { success: true };
  }

  /**
   * Fetch user info from Google
   */
  async fetchUserInfo() {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${this.token}` } }
    );

    if (response.ok) {
      this.user = await response.json();
    }
  }

  /**
   * Save session to storage
   */
  async saveSession() {
    await chrome.storage.local.set({
      user: this.user,
      token: this.token
    });
  }

  /**
   * Restore session from storage
   */
  async restoreSession() {
    const stored = await chrome.storage.local.get(['user', 'token']);

    if (stored.user && stored.token) {
      this.user = stored.user;
      this.token = stored.token;
      return true;
    }

    return false;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.user && !!this.token;
  }

  /**
   * Check if user is authorized to write (email matches)
   */
  isAuthorized() {
    return this.isAuthenticated() &&
           this.user?.email === CONFIG.AUTHORIZED_EMAIL;
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get auth token
   */
  getToken() {
    return this.token;
  }
}

export const auth = new Auth();
export default auth;
