import { VERSION_NUMBER } from "../constants/Constants";
import { SettingsConfig } from "../types";
import { keys } from "./utils";

const defaultDecay = {
  mind: 2,
  body: 2,
  cash: 2,
  work: 2,
  bond: 2,
};

export const settingsDefaults: SettingsConfig = {
  version: `${VERSION_NUMBER}`,
  firstLaunch: `${Date.now()}`,
  decayRate: JSON.stringify(defaultDecay),
  preferedChart: 'bar',
};

export const Settings = {
  currentVersion: VERSION_NUMBER,

  setup(): void {
    if (localStorage.getItem("firstLaunch") === null) {
      keys(settingsDefaults).forEach((key) => {
        settingsDefaults[key] !== undefined && localStorage.setItem(key, settingsDefaults[key]);
      });
    } else this.upgrade()
  },

  get(key: keyof SettingsConfig): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(key) ?? "";
  },

  getAll(): SettingsConfig {
    let res = settingsDefaults
    keys(settingsDefaults).forEach(k => res[k] = this.get(k))
    return res
  },

  set(key: keyof SettingsConfig, val: string): void {
    localStorage.setItem(key, val)
  },

  upgrade(): boolean {
    const clientVersion = localStorage.getItem("version");
    const needsUpgrade = !clientVersion || clientVersion && clientVersion !== this.currentVersion

    if (!needsUpgrade) return false

    const currentSettings: Partial<SettingsConfig> = {};
    // Set current settings to user's settings where we have them, if not create key with blank value
    keys(settingsDefaults).forEach((key) => currentSettings[key] = localStorage.getItem(key) ?? "")

    // Copy default values to LocalStorage
    keys(settingsDefaults).forEach((key) => settingsDefaults[key] && localStorage.setItem(key, settingsDefaults[key]))

    // For each non-blank currentSettings entry we copy that to LocalStorage
    keys(currentSettings).forEach(key => currentSettings[key] !== undefined && localStorage.setItem(key, currentSettings[key]))

    localStorage.setItem("version", VERSION_NUMBER) // Bump version number

    return true
  },

  reset(): void {
    keys(settingsDefaults).forEach((key) => {
      settingsDefaults[key] && localStorage.setItem(key, settingsDefaults[key]);
    });
  },
};
