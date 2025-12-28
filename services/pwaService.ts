/**
 * Service untuk update PWA manifest dan icons secara dinamis
 */

export interface PWASettings {
  app_name: string;
  app_logo: string; // base64
  app_favicon: string; // base64
}

/**
 * Convert base64 to blob URL
 */
function base64ToBlobUrl(base64: string): string {
  if (!base64) return '';
  
  // Handle data URL format (data:image/png;base64,...)
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    return base64; // Fallback to data URL
  }
}

/**
 * Create icon from base64 and return as data URL
 */
function createIconFromBase64(base64: string): string {
  if (!base64) {
    return ''; // Use default icon
  }

  // If it's already a data URL, use it directly
  if (base64.startsWith('data:')) {
    return base64;
  }

  // Convert base64 to data URL
  return `data:image/png;base64,${base64}`;
}

/**
 * Update PWA manifest with dynamic settings
 */
export async function updatePWAManifest(settings: PWASettings): Promise<void> {
  try {
    // Get or create manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    // Create manifest object
    const manifest: any = {
      name: settings.app_name || 'Amalan Marketer Berkah',
      short_name: settings.app_name?.substring(0, 12) || 'Amalan Berkah',
      description: 'Aplikasi evaluasi amalan harian untuk marketer berkah',
      theme_color: '#134e4a',
      background_color: '#134e4a',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: []
    };

    // Generate icons from logo if available
    if (settings.app_logo) {
      const logoDataUrl = createIconFromBase64(settings.app_logo);
      if (logoDataUrl) {
        manifest.icons.push(
          {
            src: logoDataUrl,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: logoDataUrl,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        );
      }
    }

    // Fallback to default icons if no logo
    if (manifest.icons.length === 0) {
      manifest.icons.push(
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      );
    }

    // Create blob URL for manifest
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json'
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    manifestLink.href = manifestUrl;

    console.log('✅ PWA manifest updated with custom settings');
  } catch (error) {
    console.error('Error updating PWA manifest:', error);
  }
}

/**
 * Update PWA icons in HTML
 */
export async function updatePWAIcons(settings: PWASettings): Promise<void> {
  try {
    // Update favicon
    if (settings.app_favicon) {
      const faviconLink = document.getElementById('app-favicon') as HTMLLinkElement;
      if (faviconLink) {
        const faviconDataUrl = createIconFromBase64(settings.app_favicon);
        if (faviconDataUrl) {
          faviconLink.href = faviconDataUrl;
        }
      }

      // Also update apple-touch-icon
      let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
      if (!appleTouchIcon) {
        appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleTouchIcon);
      }
      const appleIconDataUrl = createIconFromBase64(settings.app_favicon);
      if (appleIconDataUrl) {
        appleTouchIcon.href = appleIconDataUrl;
      }
    }

    // Update PWA icons (for install prompt) - create link elements if needed
    if (settings.app_logo) {
      const logoDataUrl = createIconFromBase64(settings.app_logo);

      // Create or update icon-192
      let icon192Link = document.querySelector('link[rel="icon"][sizes="192x192"]') as HTMLLinkElement;
      if (!icon192Link) {
        icon192Link = document.createElement('link');
        icon192Link.rel = 'icon';
        icon192Link.sizes = '192x192';
        document.head.appendChild(icon192Link);
      }
      if (logoDataUrl) {
        icon192Link.href = logoDataUrl;
      }

      // Create or update icon-512
      let icon512Link = document.querySelector('link[rel="icon"][sizes="512x512"]') as HTMLLinkElement;
      if (!icon512Link) {
        icon512Link = document.createElement('link');
        icon512Link.rel = 'icon';
        icon512Link.sizes = '512x512';
        document.head.appendChild(icon512Link);
      }
      if (logoDataUrl) {
        icon512Link.href = logoDataUrl;
      }
    }

    console.log('✅ PWA icons updated');
  } catch (error) {
    console.error('Error updating PWA icons:', error);
  }
}

/**
 * Initialize PWA with settings
 */
export async function initializePWA(settings: PWASettings): Promise<void> {
  try {
    await Promise.all([
      updatePWAManifest(settings),
      updatePWAIcons(settings)
    ]);
  } catch (error) {
    console.error('Error initializing PWA:', error);
  }
}

