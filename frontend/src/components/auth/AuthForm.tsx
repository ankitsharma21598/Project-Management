import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@/graphql/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import type { User as UserType } from "@/types";
import { toast } from "react-toastify";

interface LoginResponse {
  signin: {
    token: string;
    user: UserType;
  };
}

interface RegisterResponse {
  signup: {
    token: string;
    user: UserType;
  };
}

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { loading: loginLoading }] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const [register, { loading: registerLoading }] = useMutation<RegisterResponse>(REGISTER_MUTATION);

  const loading = loginLoading || registerLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    try {
      if (isLogin) {
        const { data } = await login({
          variables: { email, password },
        });
        

        if (data) {
          dispatch(
            setCredentials({
              user: data.signin.user,
              token: data.signin.token,
            })
          );

          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        const { data } = await register({
          variables: {
            input: { email, password, firstName, lastName },
          },
        });

        if (data) {
          dispatch(
            setCredentials({
              user: data.signup.user,
              token: data.signup.token,
            })
          );

          toast.success("Account created successfully!");
          navigate("/");
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-6">
          <div className="h-8 w-8 rounded-lg bg-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-muted-foreground">
          {isLogin
            ? "Sign in to continue to your workspace"
            : "Get started with your free account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <span className="text-primary font-medium">Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span className="text-primary font-medium">Sign in</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
