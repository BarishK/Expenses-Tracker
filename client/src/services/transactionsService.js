import api from "@/lib/axios";

export const getTransactions = async () => {
  try {
    const res = await api.get("/transactions");
    return res.data;
  } catch (err) {
    console.error("Veri çekme hatası:", err);
  }
};

export const deleteTransaction = async (id) => {
  try {
    return await api.delete(`/transactions/delete/${id}`);
  } catch (err) {
    console.error("Delete error", err);
  }
};
