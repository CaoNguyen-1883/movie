import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Assuming shadcn/ui Card

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLoginView ? "Login" : "Create an Account"}
          </CardTitle>
          <CardDescription>
            {isLoginView
              ? "Welcome back! Please enter your details."
              : "Fill in the form below to create your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoginView ? <LoginForm /> : <RegisterForm />}
          <div className="mt-4 text-center">
            <Button variant="link" onClick={toggleView}>
              {isLoginView
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
