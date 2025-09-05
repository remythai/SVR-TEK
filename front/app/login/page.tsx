"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
<<<<<<< HEAD
import { signIn, signUp } from "@/server/users";
import { set, z } from "zod";
=======
import { signIn } from "@/server/users";
import { z } from "zod";
>>>>>>> ac2ed8a3e6f8a73d92b58f22b9ef13a5ce99739c

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
    email: z.string().min(2).max(50),
    password: z.string().min(6).max(50),
})

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const { success, message } = await signIn(values.email, values.password);

        if (success) {
            toast.success("Logged successfully!");
            router.push('/dashboard');
            form.reset();
        } else {
            toast.error(`Error: ${message}`);
        }
        setIsLoading(false);
    }

  return (
    <>
      <div className="flex min-h-[70vh] flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
<<<<<<< HEAD
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Login to your account</h2>
=======
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Login to your account</h2>
>>>>>>> ac2ed8a3e6f8a73d92b58f22b9ef13a5ce99739c
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
<<<<<<< HEAD
                        <Input placeholder="shadcn" {...field} />
=======
                        <Input placeholder="Ex: QuentinLePlusSexy@gmail.com" {...field} />
>>>>>>> ac2ed8a3e6f8a73d92b58f22b9ef13a5ce99739c
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input placeholder="********" {...field} />
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
<<<<<<< HEAD
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
=======
                className="flex w-full justify-center rounded-md bg-primary-200 hover:bg-primary-300 transition-colors duration-300 px-3 py-1.5 text-sm/6 font-semibold text-white cursor-pointer"
>>>>>>> ac2ed8a3e6f8a73d92b58f22b9ef13a5ce99739c
              >
                {isLoading ? "..." : "Login"}
              </button>
            </div>
          </form>
          </Form>
        </div>
      </div>
    </>
  )
}
