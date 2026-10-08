const { contextBridge } = require('electron');

// Exposed to the web app as window.nexora. apiUrl overrides VITE_API_URL if set.
contextBridge.exposeInMainWorld('nexora', {
  isDesktop: true,
  platform: process.platform,
  apiUrl: process.env.NEXORA_API_URL || null,
});
