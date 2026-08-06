import api from "@/lib/axios";

export const getUser = async () => {
  try {
    const res = await api.get("/user");
    return res.data;
  } catch (err) {
    console.error("Veri çekme hatası:", err);
  }
};

export const updateProfile = async (updatedProfile) => {
  try {
    const res = await api.put("/user", updatedProfile);
    return res.data;
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    throw err;
  }
};

export const updatePassword = async (passwords) => {
  try {
    const res = await api.put("/user/change-password", passwords);
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Şifre değiştirilemedi.";
  }
};

export const deleteAccount = async () => {
  try {
    const res = await api.delete("/user");
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Hesap silinemedi.";
  }
};
