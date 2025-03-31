"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
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
import { UserData, userService } from "@/services/user.service";
import {
  leaderboardService,
  LeaderboardEntry,
} from "@/services/leaderboard.service";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
  referral_code: z.string().optional(),
});

function RegisterPageContent() {
  // Search params to get possible referral code
  const searchParams = useSearchParams();
  const referralCodeFromUrl = searchParams.get("referralCode");

  // States to control the application
  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const [showUserResult, setShowUserResult] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);
  const [error, setError] = useState("");
  const [sharingLink, setSharingLink] = useState("");

  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      referral_code: referralCodeFromUrl || "",
    },
  });

  // Updates form if referral code is present in the URL
  useEffect(() => {
    if (referralCodeFromUrl)
      registerForm.setValue("referral_code", referralCodeFromUrl);
  }, [referralCodeFromUrl, registerForm]);

  interface RegisterFormValues {
    full_name: string;
    email: string;
    phone_number: string;
  }

  // Handles the form submission
  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    try {
      // Getting user data from the server
      setError("");
      const result = await userService.create(values);
      setUserData(result.data);

      // Generate a referral code for the new registered user
      const referralCode = result.data.referral_code;
      const baseUrl = window.location.origin + window.location.pathname;
      const generatedLink = `${baseUrl}?referralCode=${referralCode}`;
      setSharingLink(generatedLink);

      // UI Handling
      setShowRegisterForm(false);
      setShowUserResult(true);
      console.log("User registered successfully:", userData);
    } catch (error) {
      console.error("Failed to register user:", error);
      setError("Failed to register user. Please try again.");
    }
  };

  // Handles the finish competition logic
  const onFinishCompetition = async (): Promise<void> => {
    try {
      setError("");
      const result = await leaderboardService.getLeaderboard();
      setLeaderboardData(result.data);
      setShowRegisterForm(false);
      setShowLeaderboard(true);
      console.log("Leaderboard data:", result);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
      setError("Failed to fetch leaderboard. Please try again.");
    }
  };

  // AUX FUNCTIONS
  // Resets the form data to the initial state
  const resetToForm = () => {
    setShowRegisterForm(true);
    setShowUserResult(false);
    setShowLeaderboard(false);
    registerForm.reset({
      full_name: "",
      email: "",
      phone_number: "",
      referral_code: referralCodeFromUrl || "",
    });
  };

  // Copies the sharing link to the clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharingLink);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const RegisterFormCard = () => (
    <Card className="p-6">
      <CardTitle className="text-center">GSS Eco News Competition!</CardTitle>
      <CardDescription className="text-center">
        Welcome to GSS Eco News Competition! Please register to participate in.
        {referralCodeFromUrl && (
          <p className="text-sm text-green-600 mt-2">
            You were invited by a friend! Your referral code is{" "}
            <strong>{referralCodeFromUrl}</strong>.
          </p>
        )}
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
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your phone number for registering.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500">{error}</p>}
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
  );

  // UserResultCard Component
  const UserResultCard = () => (
    <Card className="p-6 w-full max-w-md">
      <CardTitle className="text-center">Registration Successful!</CardTitle>
      <CardDescription className="text-center">
        Your registration has been successful. Here&apos;s your sharing link:.
      </CardDescription>
      <CardContent className="mt-4">
        <div className="space-y-2">
          <p>
            <strong>User ID:</strong> {userData?.id}
          </p>
          <p>
            <strong>Name:</strong> {userData?.full_name}
          </p>
          <p>
            <strong>Link:</strong> {userData?.referral_code}
          </p>
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-semibold mb-2">
              Share this link with friends:
            </p>
            <div className="flex items-center gap-2">
              <Input value={sharingLink} readOnly className="text-xs" />
              <Button
                type="button"
                onClick={copyToClipboard}
                className="whitespace-nowrap"
                size="sm"
              >
                Copy
              </Button>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              When friends register using your link, you&apos;ll earn points for
              the competition!
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetToForm} className="mt-4">
          Return to Registration
        </Button>
      </CardFooter>
    </Card>
  );

  // Competition result card to show the Leaderboard
  const LeaderboardCard = () => (
    <Card className="p-6 w-full max-w-md">
      <CardTitle className="text-center">Competition Results</CardTitle>
      <CardDescription className="text-center mt-2 mb-4">
        Here are the final results of the GSS Eco News Competition!
      </CardDescription>
      <CardContent>
        {leaderboardData && Array.isArray(leaderboardData) ? (
          <div className="space-y-4">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Position</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-right py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{entry.full_name}</td>
                    <td className="text-right py-2">{entry.referrals_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={resetToForm} className="mt-4">
          Return to Registration
        </Button>
      </CardFooter>
    </Card>
  );
  return (
    <div className="flex items-center justify-center p-4">
      {showRegisterForm && <RegisterFormCard />}
      {showUserResult && <UserResultCard />}
      {showLeaderboard && <LeaderboardCard />}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-4">Loading...</div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
