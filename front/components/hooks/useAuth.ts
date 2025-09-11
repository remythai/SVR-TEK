"use client";

import { useState, useEffect } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "investor" | "founder";
  founder_id?: number | null;
  investor_id?: number | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/users/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data: User = await res.json();
      setUser(data);
      console.log("User connecté :", data); // <-- console.log ici
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Erreur fetch /auth/me :", err);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser(token);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout, isLoading };
};
