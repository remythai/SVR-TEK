"use server";

import { auth } from "@/lib/auth";
import { success } from "zod";

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
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password
            }
        })

        return {
            success: true,
            message: "User created successfully"
        }

    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: { error: e.message || "An error occurred" }
        }
    }
}