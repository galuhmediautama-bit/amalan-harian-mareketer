import { supabase } from './supabase';

export interface AppSettings {
  app_name: string;
  app_logo: string;
  app_favicon: string;
}

const SETTINGS_KEYS = {
  APP_NAME: 'app_name',
  APP_LOGO: 'app_logo',
  APP_FAVICON: 'app_favicon'
} as const;

/**
 * Get all app settings
 */
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value');

    if (error) {
      console.error('Error fetching settings:', error);
      return getDefaultSettings();
    }

    const settings: AppSettings = {
      app_name: 'Amalan Marketer Berkah',
      app_logo: '',
      app_favicon: ''
    };

    if (data) {
      data.forEach((row: any) => {
        if (row.setting_key === SETTINGS_KEYS.APP_NAME) {
          settings.app_name = row.setting_value || settings.app_name;
        } else if (row.setting_key === SETTINGS_KEYS.APP_LOGO) {
          settings.app_logo = row.setting_value || '';
        } else if (row.setting_key === SETTINGS_KEYS.APP_FAVICON) {
          settings.app_favicon = row.setting_value || '';
        }
      });
    }

    return settings;
  } catch (error) {
    console.error('Error in getAppSettings:', error);
    return getDefaultSettings();
  }
}

/**
 * Update app settings (admin only)
 */
export async function updateAppSettings(settings: Partial<AppSettings>): Promise<boolean> {
  try {
    const updates = [];

    if (settings.app_name !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({
            setting_key: SETTINGS_KEYS.APP_NAME,
            setting_value: settings.app_name,
            updated_at: new Date().toISOString()
          }, { onConflict: 'setting_key' })
      );
    }

    if (settings.app_logo !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({
            setting_key: SETTINGS_KEYS.APP_LOGO,
            setting_value: settings.app_logo,
            updated_at: new Date().toISOString()
          }, { onConflict: 'setting_key' })
      );
    }

    if (settings.app_favicon !== undefined) {
      updates.push(
        supabase
          .from('app_settings')
          .upsert({
            setting_key: SETTINGS_KEYS.APP_FAVICON,
            setting_value: settings.app_favicon,
            updated_at: new Date().toISOString()
          }, { onConflict: 'setting_key' })
      );
    }

    const results = await Promise.all(updates);
    const hasError = results.some(result => result.error);

    if (hasError) {
      console.error('Error updating settings:', results);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateAppSettings:', error);
    return false;
  }
}

/**
 * Convert file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get default settings
 */
function getDefaultSettings(): AppSettings {
  return {
    app_name: 'Amalan Marketer Berkah',
    app_logo: '',
    app_favicon: ''
  };
}


