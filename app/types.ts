export type MetricName = "MIND" | "BODY" | "CASH" | "WORK" | "BOND";

export type Action = {
  id: string;
  name: string;
  effects: Record<MetricName, number>;
  energy: "draining" | "neutral" | "energising";
};

export type Metric = {
  name: MetricName | "TOTAL";
  value: number;
}

export type AppData = {
  metrics: Metric[],
}
