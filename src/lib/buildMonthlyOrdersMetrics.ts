import dayjs from "dayjs";
import type { VendorPortalMonthlyOrdersPoint } from "@/models";

export type OrdersChartPeriod = 3 | 6 | 12;
export type OrdersChartMetric = "count" | "amount";

export function formatMonthLabel(monthKey: string): string {
  const date = dayjs(`${monthKey}-01`);
  if (!date.isValid()) return monthKey;
  return date.format("MM/YY");
}

export function enrichMonthlyOrdersLabels(
  points: VendorPortalMonthlyOrdersPoint[]
): VendorPortalMonthlyOrdersPoint[] {
  return points.map((point) => ({
    ...point,
    label: formatMonthLabel(point.monthKey),
  }));
}

export function filterMonthlyOrders(
  points: VendorPortalMonthlyOrdersPoint[],
  period: OrdersChartPeriod
): VendorPortalMonthlyOrdersPoint[] {
  if (points.length <= period) return points;
  return points.slice(points.length - period);
}

export function chartHasOrdersData(points: VendorPortalMonthlyOrdersPoint[]): boolean {
  return points.some((point) => point.orderCount > 0 || point.totalAmount > 0);
}
