"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  overall?: number;
  pronunciation?: number;
  stress?: number;
  pace?: number;
}

interface ScoreChartProps {
  data: DataPoint[];
  title?: string;
  showAll?: boolean;
}

const LINES = [
  { key: "overall", color: "#4a63f7", label: "Overall" },
  { key: "pronunciation", color: "#22c55e", label: "Pronunciation" },
  { key: "stress", color: "#f59e0b", label: "Stress" },
  { key: "pace", color: "#a855f7", label: "Pace" },
];

export function ScoreChart({ data, showAll = false }: ScoreChartProps) {
  const lines = showAll ? LINES : [LINES[0]];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1d24" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#1a1d24" }}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#1a1d24" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111317",
            border: "1px solid #1a1d24",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#9ca3af" }}
          itemStyle={{ color: "#e5e7eb" }}
        />
        {showAll && (
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#6b7280" }}
          />
        )}
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: line.color }}
            name={line.label}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
