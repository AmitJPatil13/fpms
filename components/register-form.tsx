"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  register,
  sendEmailVerificationCode,
  verifyVerificationCode,
} from "redshield";
import { createUser } from "@/actions/auth";

type Step = "email" | "otp" | "register";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      // Add your send OTP API call here
      const res = await sendEmailVerificationCode({ email });
      if (res.status) {
        toast.success("OTP sent successfully!");
        setCurrentStep("otp");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      // Add your verify OTP API call here
      const res = await verifyVerificationCode({ email, code: otp });
      if (res.status) {
        toast.success("OTP verified successfully!");
        setCurrentStep("register");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await register({ email, password });

      if (res.status) {
        const createUserRes = await createUser(email, name);
        if (createUserRes.success) {
          toast.success("Registration successful!");
          router.push("/faculty");
        } else {
          toast.error(createUserRes.message);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            {currentStep === "email" && "Enter your email to get started"}
            {currentStep === "otp" && "Enter the OTP sent to your email"}
            {currentStep === "register" && "Create your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "email" && (
            <form onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full !bg-blue-500 hover:!bg-blue-600 text-white"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            </form>
          )}

          {currentStep === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full !bg-blue-500 hover:!bg-blue-600 text-white"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          )}

          {currentStep === "register" && (
            <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full !bg-blue-500 hover:!bg-blue-600 text-white"
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
