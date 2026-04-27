import { METRIC_INFO_TEXT } from "@/app/constants/Constants";
import { MetricKey } from "@/app/types";
import { LucideIcon, BadgeDollarSign, Brain, Laptop, Dumbbell, HeartPlus } from "lucide-react";

interface DisplayInfo {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
}

export default function getMetricDisplayInfo(m: MetricKey): DisplayInfo {
  switch (m) {
    case "body":
      return {
        icon: Dumbbell,
        title: 'BODY',
        subtitle: "Heart, Strength, Fitness",
        description: METRIC_INFO_TEXT.body,
      }
    case "mind":
      return {
        icon: Brain,
        title: 'MIND',
        subtitle: "Self-Care, Mentality, Positive Thoughts",
        description: METRIC_INFO_TEXT.mind,
      }
    case "cash":
      return {
        icon: BadgeDollarSign,
        title: 'CASH',
        subtitle: "Saving, Careful Spending, Frugality",
        description: METRIC_INFO_TEXT.cash,
      }
    case "work":
      return {
        icon: Laptop,
        title: 'WORK',
        subtitle: "Productivity, Study, Career",
        description: METRIC_INFO_TEXT.work,
      }
    case "bond":
      return {
        icon: HeartPlus,
        title: 'BOND',
        subtitle: "Friends, Family, Relationships",
        description: METRIC_INFO_TEXT.bond,
      }
      
    default:
      return {
        icon: HeartPlus,
        title: 'BOND',
        subtitle: "Friends, Family, Relationships",
        description: METRIC_INFO_TEXT.bond,
      }
  }
}