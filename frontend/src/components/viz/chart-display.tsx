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

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface ChartDisplayProps {
  config: ChartConfig;
}

export function ChartDisplay({ config }: ChartDisplayProps) {
  const { chart_type, title, x_key, y_key, data, x_label, y_label } = config;

  return (
    <div className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chart_type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={x_key} fontSize={11} label={{ value: x_label, position: "bottom" }} />
            <YAxis fontSize={11} label={{ value: y_label, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey={y_key} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : chart_type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={x_key} fontSize={11} label={{ value: x_label, position: "bottom" }} />
            <YAxis fontSize={11} label={{ value: y_label, angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey={y_key} stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        ) : chart_type === "pie" ? (
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey={y_key}
              nameKey={x_key}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={x_key} fontSize={11} name={x_label} />
            <YAxis dataKey={y_key} fontSize={11} name={y_label} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#3b82f6" />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
