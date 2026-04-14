import { SETTINGS_VERSION_NUMBER } from "../constants/Constants";

const defaultDecay = {
  mind: 2,
  body: 2,
  cash: 2,
  work: 2,
  bond: 2,
};

interface SettingsConfig {
  version: string
  firstLaunch: string
  decayRate: string
}

const CURRENT_VERSION = parseFloat(SETTINGS_VERSION_NUMBER)

const settingsDefaults: SettingsConfig = {
  version: `${CURRENT_VERSION}`,
  firstLaunch: `${Date.now()}`,
  decayRate: JSON.stringify(defaultDecay),
};

function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const Settings = {
  currentVersion: CURRENT_VERSION,

  setup(): void {
    if (localStorage.getItem("firstLaunch") === null) {
      keys(settingsDefaults).forEach((key) => {
        localStorage.setItem(key, settingsDefaults[key]);
      });
    } else this.upgrade()
  },

  get(key: keyof SettingsConfig): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(key) ?? "";
  },

  upgrade(): void {
    const clientVersion = localStorage.getItem("version");
    
    if (!clientVersion || clientVersion && parseFloat(clientVersion) < this.currentVersion) {
      const currentSettings: Partial<SettingsConfig> = {};

      keys(settingsDefaults).forEach((key) => {
        currentSettings[key] = localStorage.getItem(key) ?? "";
      });

      keys(settingsDefaults).forEach((key) => {
        localStorage.setItem(key, settingsDefaults[key]);
      });

      keys(currentSettings).forEach(key => currentSettings[key] !== undefined && localStorage.setItem(key, currentSettings[key]))
    }
  },

  reset(): void {
    keys(settingsDefaults).forEach((key) => {
      localStorage.setItem(key, settingsDefaults[key]);
    });
  },
};

export default Settings;
