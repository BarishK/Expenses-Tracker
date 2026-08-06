import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // BU SATIR ÇOK ÖNEMLİ: Cookie gönderimi için gerekli
});

export default api;
