import api from "@/lib/axios";

export const getDashboardCharts = async () => {
  try {
    const res = await api.get("/dashboard/dashboard-charts");
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Grafik verileri alınamadı.";
  }
};
