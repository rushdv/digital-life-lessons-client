import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '').replace(/\/$/, ''),
});

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) config.headers.authorization = `Bearer ${token}`;
      return config;
    });

    axiosSecure.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(err);
      }
    );
  }, []);

  return axiosSecure;
};

export default useAxiosSecure;