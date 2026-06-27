import { useMemo, useState } from "react";
import { Banknote, ChartArea, Hash, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { VendorPortalMonthlyOrdersPoint } from "@/models";
import {
  chartHasOrdersData,
  enrichMonthlyOrdersLabels,
  filterMonthlyOrders,
  type OrdersChartMetric,
  type OrdersChartPeriod,
} from "@/lib/buildMonthlyOrdersMetrics";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface DashboardOrdersChartPanelProps {
  monthlyOrders: VendorPortalMonthlyOrdersPoint[];
  loading?: boolean;
}

interface ChartPoint extends VendorPortalMonthlyOrdersPoint {
  chartValue: number;
}

function ChartTooltip({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
  metric: OrdersChartMetric;
}) {
  const { t } = useTranslation("dashboard");

  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-lg border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-[var(--letmesee-foreground)]">{point.label}</p>
      <p className="text-[var(--letmesee-purple)]">
        {metric === "count"
          ? t("ordersChart.tooltipCount", { count: point.orderCount })
          : t("ordersChart.tooltipAmount", { amount: formatCurrency(point.totalAmount) })}
      </p>
    </div>
  );
}

export function DashboardOrdersChartPanel({
  monthlyOrders,
  loading,
}: DashboardOrdersChartPanelProps) {
  const { t } = useTranslation("dashboard");
  const { resolvedTheme } = useTheme();
  const [period, setPeriod] = useState<OrdersChartPeriod>(3);
  const [metric, setMetric] = useState<OrdersChartMetric>("amount");

  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#3f3f46" : "#e5e7eb";
  const tickColor = isDark ? "#a1a1aa" : "#64748b";
  const chartColor = "var(--letmesee-purple, #835afd)";

  const periodOptions: { value: OrdersChartPeriod; label: string }[] = [
    { value: 3, label: t("ordersChart.period3") },
    { value: 6, label: t("ordersChart.period6") },
    { value: 12, label: t("ordersChart.period12") },
  ];

  const metricOptions: { value: OrdersChartMetric; label: string; icon: LucideIcon }[] = [
    { value: "count", label: t("ordersChart.metricCount"), icon: Hash },
    { value: "amount", label: t("ordersChart.metricAmount"), icon: Banknote },
  ];

  const chartData = useMemo(() => {
    const labeled = enrichMonthlyOrdersLabels(monthlyOrders);
    const filtered = filterMonthlyOrders(labeled, period);
    return filtered.map((point) => ({
      ...point,
      chartValue: metric === "count" ? point.orderCount : point.totalAmount,
    }));
  }, [monthlyOrders, period, metric]);

  const hasData = chartHasOrdersData(chartData);
  const totalInPeriod = chartData.reduce(
    (sum, item) => sum + (metric === "count" ? item.orderCount : item.totalAmount),
    0
  );

  if (loading) {
    return (
      <div className="h-full min-h-[18rem] animate-pulse rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)] lg:min-h-[20rem]" />
    );
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--letmesee-foreground)]">
            {t("ordersChart.title")}
          </h2>
          <p className="mt-0.5 text-xs text-[var(--letmesee-muted)]">{t("ordersChart.subtitle")}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--letmesee-muted)]">
            {metric === "count" ? t("ordersChart.metricCount") : t("ordersChart.metricAmount")}
          </p>
          <p className="text-lg font-bold tabular-nums text-[var(--letmesee-foreground)]">
            {metric === "count"
              ? totalInPeriod
              : formatCurrency(totalInPeriod)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {metricOptions.map((option) => {
            const Icon = option.icon;
            const isActive = metric === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setMetric(option.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                  isActive
                    ? "bg-[var(--letmesee-purple)]/15 text-[var(--letmesee-purple)] ring-1 ring-[var(--letmesee-purple)]/25"
                    : "bg-[var(--letmesee-surface-subtle)] text-[var(--letmesee-muted)] hover:bg-[var(--letmesee-purple)]/10"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 self-end sm:self-auto">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              aria-pressed={period === option.value}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
                period === option.value
                  ? "bg-[var(--letmesee-purple)] text-white"
                  : "bg-[var(--letmesee-surface-subtle)] text-[var(--letmesee-muted)] hover:bg-[var(--letmesee-purple)]/10"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex-1">
        {!hasData ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[var(--letmesee-purple)]/25 bg-gradient-to-b from-[var(--letmesee-purple)]/[0.07] to-transparent px-6 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--letmesee-purple)]/10 shadow-sm ring-1 ring-[var(--letmesee-purple)]/20">
              <ChartArea
                className="h-7 w-7 text-[var(--letmesee-purple)]"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            <div className="max-w-xs space-y-1">
              <p className="text-sm font-medium text-[var(--letmesee-foreground)]">
                {t("ordersChart.empty")}
              </p>
              <p className="text-xs leading-relaxed text-[var(--letmesee-muted)]">
                {t("ordersChart.emptyHint")}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordersAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#835afd" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#835afd" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: tickColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) =>
                    metric === "count"
                      ? String(Math.round(Number(value)))
                      : formatCompactCurrency(Number(value))
                  }
                  tick={{ fontSize: 11, fill: tickColor }}
                  axisLine={false}
                  tickLine={false}
                  width={56}
                />
                <Tooltip content={<ChartTooltip metric={metric} />} />
                <Area
                  type="monotone"
                  dataKey="chartValue"
                  stroke={chartColor}
                  strokeWidth={2}
                  fill="url(#ordersAreaGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="chartValue"
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}
