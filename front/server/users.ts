"use server";

export const signIn = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:8000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error || "Error login user" };
    }

    const token = data.access_token;

    return {
      success: true,
      message: "User logged successfully",
      user: data.user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An error occurred",
    };
  }
};

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

    const token = data.access_token;

    return {
      success: true,
      message: "User created successfully",
      user: data.user,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An error occurred",
    };
  }
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  token: string) => {
  try {
    if (typeof window !== "undefined")
      throw Error;
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }
    const res = await fetch("http://localhost:8000/users/update-password", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.error || "Error changing password" };
    }

    return {
      success: true,
      message: data.message || "Password changed successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An error occurred",
    };
  }
};