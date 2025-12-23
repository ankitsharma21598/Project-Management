import { AuthForm } from "../components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
