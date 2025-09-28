"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUsername, registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { signInSchema, signUpSchema } from "@/types/auth";
import { useDebouncedCallback } from "use-debounce";

import { FcGoogle } from "react-icons/fc";

type FormErrors = Partial<Record<"username" | "email" | "password", string>>;

export default function TypeFastAuth() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [usernameStatus, setUsernameStatus] = useState<"available" | "taken" | "checking" | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const debouncedCheckUsername = useDebouncedCallback(async (username: string) => {
    if (!username.trim()) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus("checking");
    try {
      const res = await checkUsername(username);
      setUsernameStatus(res.available ? "available" : "taken");
    } catch {
      setUsernameStatus(null);
    }
  }, 500);


  const handleSubmit = async (type: "signin" | "signup") => {
    setErrors({});

    if (type === "signin") {
      setIsLoading(true)
      const result = signInSchema.safeParse({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        toast.error("Please enter valid sign-in data");
        setIsLoading(false)
        return;
      }

      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login Successful");
        setTimeout(() => {
          window.location.reload()
        }, 2000);
      } else {
        toast.error(res?.error || "Login Failed");
        setIsLoading(false)
      }

    } else {
      setIsLoading(true);
      const result = signUpSchema.safeParse(formData);

      if (!result.success) {
        toast.error("Please fill all fields correctly");
        setIsLoading(false);
        return;
      }

      try {
        const res = await registerUser(formData);
        if (res.success) {
          toast.success("Registration Successful");
          setFormData({ username: "", email: "", password: "" });
          setActiveTab("signin");
          setIsLoading(false);
        }
        if (res.error) {
          toast.error(res.error);
          setErrors({ email: res.error });
          setIsLoading(false);
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    }
  };




  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center mt-10 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-[30rem] shadow-sm py-5 px-5  sm:py-10 sm:px-10">
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-2">Welcome to TypeFast</h1>
          <p className="text-gray-400">
            Sign in to your account
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
                        placeholder="john@gmail.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Credentials Sign In */}
                  <Button
                    disabled={isLoading}
                    onClick={() => handleSubmit("signin")}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-colors"
                  >
                    {isLoading ? ("Sigining...") : (" Sign In →")}
                  </Button>

                  {/* Divider */}
                  <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-700"></div>
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow h-px bg-gray-700"></div>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    onClick={() => signIn("google", { callbackUrl: "/type" })}
                    className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <FcGoogle />
                    Sign in with Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Sign Up */}
          <TabsContent value="signup" className="mt-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-300">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={formData.username}
                        onChange={(e) => {
                          handleInputChange("username", e.target.value);
                          debouncedCheckUsername(e.target.value);
                        }}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
                        placeholder="johndoe"
                      />
                    </div>
                    <div className="mt-4">
                      {usernameStatus === "checking" && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking...</span>
                        </div>
                      )}
                      {usernameStatus === "available" && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Username available</span>
                        </div>
                      )}
                      {usernameStatus === "taken" && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          <span>Username already taken</span>
                        </div>
                      )}
                      {errors.username && (
                        <p className="text-red-400 text-sm">{errors.username}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
                        placeholder="john@gmail.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <Button
                    disabled={isLoading}
                    onClick={() => handleSubmit("signup")}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-colors"
                  >
                    {isLoading ? "Signing Up..." : "Sign Up →"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
