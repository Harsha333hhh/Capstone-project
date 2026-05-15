import { create } from "zustand";
import axios from "axios";

export const useAuth = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    login: async (userCredWithRole) => {
        try {
            set({ loading: true, error: null });
            const res = await axios.post("http://localhost:4000/common-api/login", userCredWithRole,{withCredentials:true
            });
console.log("Login response:", res);
            set({
                loading: false,
                error: null,
                isAuthenticated: true,
                currentUser: res.data?.payload ?? null,
            });
        } catch (err) {
            set({
                loading: false,
                error: err?.response?.data?.message || err.message,
                isAuthenticated: false,
                currentUser: null,
            });
        }
    },
    logout: async () => {
        try {
            set({ loading: true, error: null });
            await axios.post("http://localhost:4000/common-api/logout", {}, { withCredentials: true });
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: null,
            });
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err?.response?.data?.message || err.message,
            });
        }
    },
    clearError: () => {
        set({ error: null });
    }
}))