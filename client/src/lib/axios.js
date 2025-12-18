import axios from "axios"

export  const axiosInstance= axios.create({
    baseURL:"https://event-platform-7gnx.onrender.com/api/users",
    withCredentials:true
})



 const api = axios.create({
  baseURL: "https://event-platform-7gnx.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api
