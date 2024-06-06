"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MainFormSchema from "@/schema/Main-form.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the form component
export function MainForm() {
  // Use useForm hook
  const form = useForm<z.infer<typeof MainFormSchema>>({
    resolver: zodResolver(MainFormSchema),
    defaultValues: {
      name: "",
      email: "",
      questions: "", // Default one empty question
    },
  });

  // Define the submit handler
  function onSubmit(values: z.infer<typeof MainFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <Form {...form}>
        <div className="border border-gray-400 p-10 rounded-md text-start bg-gray-950">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Abhishek" className="bg-transparent" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide your username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Stark@starkindustries.in" className="bg-transparent" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">Questions</FormLabel>
                  <FormControl>
                    <Input placeholder="how to center a div? " className="bg-transparent" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide the questions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
            <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
}
