"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ChartConfig } from "@/lib/types";
import { BarChart3 } from "lucide-react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

interface ChartDisplayProps {
  config: ChartConfig;
}

export function ChartDisplay({ config }: ChartDisplayProps) {
  const { chart_type, title, x_key, y_key, data, x_label, y_label } = config;

  return (
    <div className="mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <BarChart3 className="h-3.5 w-3.5 text-[var(--primary)]" />
        <h3 className="text-xs font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={280}>
          {chart_type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey={x_key}
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
                label={{
                  value: x_label,
                  position: "bottom",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <YAxis
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
                label={{
                  value: y_label,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey={y_key} radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chart_type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey={x_key}
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey={y_key}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3b82f6" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : chart_type === "pie" ? (
            <PieChart>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Pie
                data={data}
                dataKey={y_key}
                nameKey={x_key}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                label={({ name }) => name}
                labelLine={{ stroke: "var(--muted-foreground)" }}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <ScatterChart>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey={x_key}
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
                name={x_label}
              />
              <YAxis
                dataKey={y_key}
                fontSize={10}
                tick={{ fill: "var(--muted-foreground)" }}
                name={y_label}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={data} fill="#3b82f6" />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
