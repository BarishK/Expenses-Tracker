"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
];

export default function CategoryPieChart({
  data,
  currencySymbol,
  colorOffset = 0,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            borderRadius: "8px",
            border: "none",
            color: "#fff",
          }}
          formatter={(value) => [`${value}${currencySymbol}`, "Amount"]}
        />
        <Legend />
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={55}
          paddingAngle={4}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[(index + colorOffset) % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
