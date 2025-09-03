"use server";

import { auth } from "@/lib/auth";

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "simon@test.com",
            password: "password123"
        }
    })
}

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:8000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error || "Error creating user" };
    }

    return {
      success: true,
      message: "User created successfully",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An error occurred",
    };
  }
};
