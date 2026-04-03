import { days } from "../dateTime";
import createLineChartData from "./createLineChartData";

const createLineChartDataByWeek = (values: number[][]): object => createLineChartData(days, values)

export default createLineChartDataByWeek
