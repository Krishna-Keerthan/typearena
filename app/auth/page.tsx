"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Types for form data and validation
interface FormData {
  name: string;
  email: string;
  password: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface SchemaField {
  email?: boolean;
  password?: boolean;
  name?: boolean;
}

// Simple Zod-like validation (since we can't import actual Zod)
const createSchema = (fields: SchemaField) => ({
  parse: (data: Partial<FormData>) => {
    const errors: ValidationErrors = {};
    
    if (fields.email && data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    if (fields.password && data.password) {
      if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }
    
    if (fields.name && data.name) {
      if (data.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
    }
    
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    
    return data;
  }
});

const signInSchema = createSchema({ email: true, password: true });
const signUpSchema = createSchema({ name: true, email: true, password: true });

export default function TypeFastAuth(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (type: "signin" | "signup"): void => {
    try {
      setErrors({});
      if (type === "signin") {
        signInSchema.parse({ email: formData.email, password: formData.password });
        console.log("Sign in successful");
      } else {
        signUpSchema.parse(formData);
        console.log("Sign up successful");
      }
    } catch (error) {
      const parsedErrors = JSON.parse((error as Error).message);
      setErrors(parsedErrors);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
     
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 ">
        <div className="w-[550px] max-w-[90%] bg-card p-12  rounded-2xl mt-12">
         <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              Welcome to TypeFast
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Sign in to your account or create a new one
            </p>
          </div>


          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700 rounded-lg">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-md"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 rounded-md"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signin-email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 rounded-lg h-12"
                      placeholder="john@gmail.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 rounded-lg h-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                <Button 
                  onClick={() => handleSubmit("signin")}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold h-12 rounded-lg transition-colors"
                >
                  Sign In →
                </Button>

                <Button 
                  variant="outline"
                  className="w-full bg-white border-gray-300 text-black hover:bg-gray-100 h-12 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-white text-sm">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-name"
                      type="text"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 rounded-lg h-12"
                      placeholder="Name"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 rounded-lg h-12"
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-green-500 rounded-lg h-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                <Button 
                  onClick={() => handleSubmit("signup")}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold h-12 rounded-lg transition-colors"
                >
                  Sign Up →
                </Button>

                <Button 
                  variant="outline"
                  className="w-full bg-white border-gray-300 text-black hover:bg-gray-100 h-12 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}