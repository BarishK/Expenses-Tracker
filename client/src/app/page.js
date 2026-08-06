"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getCurrencySymbol } from "@/lib/utils";
import { getTransactions } from "@/services/transactionsService";
import { getUser } from "@/services/userService";
import { getDashboardCharts } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Tüm grafik mantığını taşıdığımız bileşeni SSR kapalı çağırıyoruz
const CategoryPieChart = dynamic(
  () => import("@/components/CategoryPieChart"),
  { ssr: false },
);

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
            <div className="h-[320px] w-full flex items-center justify-center">
              {!mounted ? (
                <Spinner />
              ) : chartData.expensesByCategory.length === 0 ? (
                <div className="text-muted-foreground">
                  No expense data available yet.
                </div>
              ) : (
                <CategoryPieChart
                  data={chartData.expensesByCategory}
                  currencySymbol={currencySymbol}
                  colorOffset={0}
                />
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
            <div className="h-[320px] w-full flex items-center justify-center">
              {!mounted ? (
                <Spinner />
              ) : chartData.incomesByCategory.length === 0 ? (
                <div className="text-muted-foreground">
                  No income data available yet.
                </div>
              ) : (
                <CategoryPieChart
                  data={chartData.incomesByCategory}
                  currencySymbol={currencySymbol}
                  colorOffset={2}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
