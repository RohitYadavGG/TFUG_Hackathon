'use client';

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
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("abc.xyz@mail.com");
  const [password, setPassword] = useState("admin");
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back, Safety Admin!",
      });
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <div className="flex size-14 items-center justify-center rounded-lg bg-primary">
                    <Logo className="size-8 text-primary-foreground" />
                </div>
            </div>
          <CardTitle className="text-2xl font-headline">Welcome to SmartGuard</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Sign In</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
