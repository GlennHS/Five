export type Metric = "MIND" | "BODY" | "CASH" | "WORK" | "BOND";

export type Action = {
  id: string;
  name: string;
  effects: Record<Metric, number>;
  energy: "draining" | "neutral" | "energising";
};
