"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
// import { socialLogin } from '@/lib/action';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(8, "Confirm your password"),
    role: z.enum(["startup", "investor"]),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      role: undefined as any,
    },
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email(
        {
          email: values.email, // user email address
          password: values.password, // user password -> min 8 characters by default
          name: values.name, // user display name
          // @ts-ignore
          role: values.role, // user role
          callbackURL: "/dashboard", // redirect after verification
        },
        {
          onRequest: (ctx) => {
            //show loading
          },
          onSuccess: (ctx) => {
            toast.success(
              "Account created. Please verify your email to sign in.",
            );
            router.push("/login");
          },
          onError: (ctx) => {
            // display the error message
            toast.error(ctx.error.message);
          },
        },
      );
      console.log("SignupForm data", data, error);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login",
        newUserCallbackURL: "/dashboard",
        disableRedirect: true,
      });
    } catch (err) {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* <Button
                onClick={handleGoogle}
                variant="outline"
                size="lg"
                className="bg-background hover:bg-accent w-full"
                disabled={googleLoading}
            >
                {googleLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                    <FcGoogle className="mr-2 size-5" />
                )}
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button> */}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">Or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            required
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name?.message ? (
            <p className="text-destructive mt-1 text-xs">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email?.message ? (
            <p className="text-destructive mt-1 text-xs">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password?.message ? (
            <p className="text-destructive mt-1 text-xs">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            required
            aria-invalid={!!errors.confirm}
            {...register("confirm")}
          />
          {errors.confirm?.message ? (
            <p className="text-destructive mt-1 text-xs">
              {errors.confirm.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label>How will you use Diamond AI?</Label>
          <Controller
            control={control}
            name="role"
            render={({ field, fieldState }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!fieldState.error}
                  >
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">
                      I'm building a startup
                    </SelectItem>
                    <SelectItem value="investor">I'm here to invest</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error?.message ? (
                  <p className="text-destructive mt-1 text-xs">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || isSubmitting}
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
