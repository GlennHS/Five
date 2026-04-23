import { ChangelogEntry } from "./types";

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-04-23",
    version: "v0.2.2-alpha",
    changes: [
      { type: "feat", notes: "Completely overhaul the metric pages!!!" },
      { type: "fix", notes: "Fix version modal's styling and display" },
      { type: "style", notes: "Update the section divider's styling" },
      { type: "style", notes: "Update footer styling" },
      { type: "fix", notes: "Archived actions now hidden from tracking page" },
      { type: "feat", notes: "Add FAQ page" },
      { type: "fix", notes: "Fix action cards overflowing" },
      { type: "fix", notes: "Fix Navbar sometimes not showing" },
    ],
  },
  {
    date: "2026-04-20",
    version: "v0.2.1-alpha",
    changes: [
      { type: "fix", notes: "Fix tutorial button navigation to homepage" },
      { type: "fix", notes: "Fix FiveBar legend incorrectly displaying" },
    ],
  },
  {
    date: "2026-04-19",
    version: "v0.2.0-alpha",
    changes: [
      { type: "feat", notes: "Add onboarding flow" },
      { type: "feat", notes: "Remove action-dependent homepage modules when no actions exist" },
      { type: "fix", notes: "Fix advanced log modal issues on homepage" },
      { type: "fix", notes: "Fix various chart and quote issues" },
    ],
  },
  {
    date: "2026-04-18",
    version: "v0.1.3-alpha",
    changes: [
      { type: "feat", notes: "Add Radar graph option with interactions and improved styling" },
      { type: "feat", notes: "Add goal line to charts" },
      { type: "feat", notes: "Add motivational quotes to homepage" },
      { type: "fix", notes: "Fix chart datalabels plugin leaking into bar charts" },
    ],
  },
  {
    date: "2026-04-17",
    version: "v0.1.2-alpha",
    changes: [
      { type: "feat", notes: "Introduce version modal on app updates" },
      { type: "feat", notes: "Add settings page with editable user configuration" },
      { type: "feat", notes: "Add reset-to-factory-settings option" },
      { type: "refactor", notes: "Improve settings version handling and initialization" },
      { type: "fix", notes: "Fix version modal visibility issues" },
    ],
  },
  {
    date: "2026-04-15",
    version: "v0.1.1-alpha",
    changes: [
      { type: "feat", notes: "Add Ko-fi support link" },
      { type: "feat", notes: "Rework toast system with queueing and improved UX" },
      { type: "fix", notes: "Fix layout and homepage metric calculations" },
      { type: "fix", notes: "Fix multiple UI inconsistencies across homepage and settings" },
    ],
  },
  {
    date: "2026-04-13",
    version: "v0.1.0-alpha",
    changes: [
      { type: "feat", notes: "Add habits to homepage" },
      { type: "feat", notes: "Introduce useTracking and useInsights hooks" },
      { type: "feat", notes: "Implement advanced action logging (notes and historic entries)" },
      { type: "feat", notes: "Add filtering, sorting, and search to tracking" },
      { type: "refactor", notes: "Restructure toast system using context" },
      { type: "fix", notes: "Fix mobile interaction issues (zoom/panning on inputs)" },
    ],
  },
  {
    date: "2026-04-10",
    version: "v0.0.2-alpha",
    changes: [
      { type: "feat", notes: "Add application settings with initial metric configuration" },
      { type: "feat", notes: "Display metric deltas and improve metric pages" },
      { type: "fix", notes: "Fix app breaking on fresh start with no actions" },
      { type: "fix", notes: "Fix multiple tracking and filtering edge cases" },
    ],
  },
  {
    date: "2026-04-08",
    version: "v0.0.1-alpha",
    changes: [
      { type: "feat", notes: "Initial tracking system with actions and metrics" },
      { type: "feat", notes: "Basic UI structure including homepage and tracking page" },
      { type: "docs", notes: "Initial README and project setup" },
    ],
  },
]

export default CHANGELOG
