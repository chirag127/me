/**
 * Project Me - Main Entry Point
 * Bootloader: Initializes Puter.js, mounts Shell, and starts Router
 */

import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Shell } from './core/shell';
import { initServices } from './services/init';
import { initFirebase } from './services/firebase';

// Initialize third-party services early (analytics, etc.)
initServices();

// Initialize Firebase
initFirebase();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error('App container not found');
    return;
  }

  // Show loading state
  app.innerHTML = `
    <div class="boot-screen">
      <div class="boot-logo">CS</div>
      <div class="boot-text">Initializing Project Me...</div>
      <div class="boot-progress">
        <div class="boot-progress-bar"></div>
      </div>
    </div>
    <style>
      .boot-screen {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #000;
        gap: 1.5rem;
      }
      .boot-logo {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #007AFF, #5856D6);
        border-radius: 20px;
        font-size: 2rem;
        font-weight: 700;
        color: white;
        animation: pulse 2s ease-in-out infinite;
      }
      .boot-text {
        color: rgba(255,255,255,0.6);
        font-size: 0.875rem;
      }
      .boot-progress {
        width: 200px;
        height: 4px;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        overflow: hidden;
      }
      .boot-progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #007AFF, #5856D6);
        animation: load 1.5s ease-out forwards;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes load {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
      }
    </style>
  `;

  // Wait for Puter.js to load (it's loaded via script tag in HTML)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Initialize the shell
  try {
    const shell = new Shell(app);
    await shell.init();

    console.log('✨ Project Me initialized successfully');
    console.log('📊 Visit count:', localStorage.getItem('pm-visits'));
  } catch (error) {
    console.error('Failed to initialize:', error);
    app.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; color: white; text-align: center; padding: 2rem;">
        <h1 style="margin-bottom: 1rem;">Failed to Initialize</h1>
        <p style="margin-bottom: 2rem; color: rgba(255,255,255,0.6);">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: #007AFF; color: white; border: none; border-radius: 10px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('PWA customized ready');
    } catch (error) {
      console.log('PWA registration failed:', error);
    }
  });
}
