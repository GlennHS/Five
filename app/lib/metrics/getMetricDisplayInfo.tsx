import { METRIC_COLORS } from "@/app/constants/Colors";
import { METRIC_INFO_TEXT } from "@/app/constants/Constants";
import { MetricKey } from "@/app/types";
import { LucideIcon, BadgeDollarSign, Brain, Handshake, HeartPlus, HeartPulse } from "lucide-react";

interface DisplayInfo {
  icon: LucideIcon
  title: string
  subtitle: string
}

export default function getMetricDisplayInfo(m: MetricKey): DisplayInfo {
  switch (m) {
    case "body":
      return {
        icon: HeartPulse,
        title: 'BODY',
        subtitle: METRIC_INFO_TEXT.body,
      }
    case "mind":
      return {
        icon: Brain,
        title: 'MIND',
        subtitle: METRIC_INFO_TEXT.mind,
      }
    case "cash":
      return {
        icon: BadgeDollarSign,
        title: 'CASH',
        subtitle: METRIC_INFO_TEXT.cash,
      }
    case "work":
      return {
        icon: Handshake,
        title: 'WORK',
        subtitle: METRIC_INFO_TEXT.work,
      }
    case "bond":
      return {
        icon: HeartPlus,
        title: 'BOND',
        subtitle: METRIC_INFO_TEXT.bond,
      }
  
    default:
      return {
        icon: HeartPlus,
        title: 'BOND',
        subtitle: METRIC_INFO_TEXT.bond,
      }
  }
}