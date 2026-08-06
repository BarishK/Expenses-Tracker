"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getCurrencySymbol } from "@/lib/utils";
import { getTransactions } from "@/services/transactionsService";
import { getUser } from "@/services/userService";
import { getDashboardCharts } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
];

export default function Dashboard() {
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [mounted, setMounted] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState({
    expensesByCategory: [],
    incomesByCategory: [],
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [transRes, userRes, chartRes] = await Promise.all([
          getTransactions(),
          getUser(),
          getDashboardCharts(),
        ]);

        if (transRes) setTransactions(transRes);

        if (userRes && userRes.currency) {
          setCurrencySymbol(getCurrencySymbol(userRes.currency));
        }

        if (chartRes) {
          setChartData({
            expensesByCategory: (chartRes.expensesByCategory || []).map(
              (item) => ({
                ...item,
                total: Number(item.total),
              }),
            ),
            incomesByCategory: (chartRes.incomesByCategory || []).map(
              (item) => ({
                ...item,
                total: Number(item.total),
              }),
            ),
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setMounted(true);
      }
    };

    loadDashboardData();
  }, []);

  const totalBalance = transactions.reduce((acc, curr) => {
    const amount = Number(curr.amount);
    return curr.type === "income" ? acc + amount : acc - amount;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mounted ? `${totalBalance}${currencySymbol}` : <Spinner />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {mounted ? `${totalIncome}${currencySymbol}` : <Spinner />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mounted ? `${totalExpense}${currencySymbol}` : <Spinner />}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">
              Expense Distribution (By Category)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              {!mounted ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              ) : chartData.expensesByCategory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No expense data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: "8px",
                        border: "none",
                      }}
                      formatter={(value) => [
                        `${value}${currencySymbol}`,
                        "Amount",
                      ]}
                    />
                    <Legend />
                    <Pie
                      data={chartData.expensesByCategory}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      {chartData.expensesByCategory.map((_, index) => (
                        <Cell
                          key={`expense-cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-500">
              Income Distribution (By Category)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              {!mounted ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              ) : chartData.incomesByCategory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No income data available yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: "8px",
                        border: "none",
                      }}
                      formatter={(value) => [
                        `${value}${currencySymbol}`,
                        "Amount",
                      ]}
                    />
                    <Legend />
                    <Pie
                      data={chartData.incomesByCategory}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      {chartData.incomesByCategory.map((_, index) => (
                        <Cell
                          key={`income-cell-${index}`}
                          fill={COLORS[(index + 2) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
