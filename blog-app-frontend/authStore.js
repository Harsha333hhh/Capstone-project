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
            const userData = res.data?.payload ?? null;
            set({
                loading: false,
                error: null,
                isAuthenticated: true,
                currentUser: userData,
            });
            // Persist to localStorage
            if (userData) {
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');
            }
        } catch (err) {
            set({
                loading: false,
                error: err?.response?.data?.message || err.message,
                isAuthenticated: false,
                currentUser: null,
            });
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
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
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err?.response?.data?.message || err.message,
            });
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }
    },
    clearError: () => {
        set({ error: null });
    },
    initializeAuth: () => {
        const user = localStorage.getItem('user');
        const isAuth = localStorage.getItem('isAuthenticated');
        
        if (user && isAuth === 'true') {
            try {
                set({
                    currentUser: JSON.parse(user),
                    isAuthenticated: true,
                });
                console.log("Auth restored from localStorage");
            } catch (err) {
                console.error("Error restoring auth from localStorage:", err);
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            }
        }
    }
}))