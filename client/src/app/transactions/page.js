"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteTransaction,
  getTransactions,
} from "@/services/transactionsService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getCurrencySymbol } from "@/lib/utils";
import { getUser } from "@/services/userService";

export default function TransactionsPage() {
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [transactions, setTransactions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });

  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data || []);
  };

  useEffect(() => {
    const fetchUserCurrency = async () => {
      const data = await getUser();
      if (data && data.currency) {
        setCurrencySymbol(getCurrencySymbol(data.currency));
      }
    };

    fetchUserCurrency();
    fetchTransactions();
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/transactions", formData);
      setIsDialogOpen(false);
      setFormData({
        amount: "",
        type: "expense",
        category: "",
        description: "",
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Failed to save transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add New Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                required
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">🍔 Food</SelectItem>
                  <SelectItem value="market">🛒 Market</SelectItem>
                  <SelectItem value="bills">⚡ Bills</SelectItem>
                  <SelectItem value="rent">🏠 Rent</SelectItem>
                  <SelectItem value="transport">🚗 Transportation</SelectItem>
                  <SelectItem value="shopping">🛍️ Shopping</SelectItem>
                  <SelectItem value="entertainment">
                    🎮 Entertainment
                  </SelectItem>
                  <SelectItem value="health">💊 Health</SelectItem>
                  <SelectItem value="salary">💼 Salary</SelectItem>
                  <SelectItem value="freelance">💻 Freelance</SelectItem>
                  <SelectItem value="investment">📈 Investment</SelectItem>
                  <SelectItem value="gift">🎁 Gift</SelectItem>
                  <SelectItem value="other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                {t.date ? new Date(t.date).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell className="capitalize">{t.category}</TableCell>
              <TableCell
                className={
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                {t.type === "income" ? "Income" : "Expense"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {t.amount} {currencySymbol}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This transaction will be
                        permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(t.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
