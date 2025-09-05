"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updatePassword } from "@/server/users";
import { set, z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    oldPassword: z.string().min(2).max(50),
    newPassword: z.string().min(6).max(50),
    confirmNewPassword: z.string().min(6).max(50),
})

export default function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const token = localStorage.getItem("access_token");
        if (token !== null) {
          const { success, message } = await updatePassword(values.oldPassword, values.newPassword, values.confirmNewPassword, token);
        if (success) {
            toast.success("Password changed successfully!");
            router.push('/dashboard');
            form.reset();
        } else {
            toast.error(`Error: ${message}`);
        }
        setIsLoading(false);
      }
    }
  return (
    <>
      <div className="flex min-h-[70vh] flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Change password</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="oldPassword123" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="newPassword123" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div>
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="newPassword123" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {isLoading ? "..." : "Submit"}
              </button>
            </div>
          </form>
          </Form>
        </div>
      </div>
    </>
  )
}
