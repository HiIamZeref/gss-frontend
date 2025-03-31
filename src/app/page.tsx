"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userService } from "@/services/user.service";
import { leaderboardService } from "@/services/leaderboard.service";

// RegisterForm Schema
const registerFormSchema = z.object({
  full_name: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 characters long",
  }),
});

export default function RegisterPage() {
  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
    },
  });

  interface RegisterFormValues {
    full_name: string;
    email: string;
    phone_number: string;
  }

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      const userData = await userService.create(values);
      console.log("User registered successfully:", userData);
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  const onFinishCompetition = async (): Promise<void> => {
    try {
      const leaderboardData = await leaderboardService.getLeaderboard();
      console.log("Leaderboard data:", leaderboardData);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="p-6">
        <CardTitle className="text-center">GSS Eco News Competition!</CardTitle>
        <CardDescription className="text-center">
          Welcome to GSS Eco News Competition! Please register to participate
          in.
        </CardDescription>
        <CardContent>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name:</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your full name for registering.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address to receive updates on your
                        points.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your phone number for registering.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full cursor-pointer">
                  Register
                </Button>
                <Button
                  type="button"
                  onClick={onFinishCompetition}
                  className="w-full cursor-pointer"
                >
                  Finish competition!
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
