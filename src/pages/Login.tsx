import { FC, useState } from "react";
import { Link, Navigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Hooks
import { useAuth } from "../hooks/useAuth";

// Components
import Logo from "../components/Logo";
import {
  CheckIcon,
  HideIcon,
  ShowIcon,
  SpinnerIcon,
} from "../components/Icons";

// Types
import { LoginFormInputs } from "../types/forms";

// Utils
import { cn } from "../utils/styles";
import { getErrorMessage } from "../utils/error";

const Login: FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPasswords] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormInputs>();

  const togglePassword = () => {
    return setShowPasswords((prev) => !prev);
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data);
      toast.success("Successfully logged in!");
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <main className="flex items-center justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-96 flex-col gap-8 font-sans"
      >
        <Logo full={true} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-grey-500">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@example.com"
              className={cn(
                "rounded-[4px] bg-white px-5 py-3 text-sm font-medium text-purple outline-none ring-1 ring-grey-500/25 transition-colors focus:ring-purple dark:bg-grey-800",
                errors.email && "ring-1 ring-red",
              )}
              {...register("email", { required: "Email is required" })}
            />

            {errors.email && (
              <p className="text-xs text-red">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 text-grey-500">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div
              className={cn(
                "relative rounded-[4px] bg-white px-5 py-3 text-sm font-medium text-purple outline-none ring-1 ring-grey-500/25 transition-colors focus-within:ring-1 focus-within:ring-purple dark:bg-grey-800",
                errors.password && "ring-1 ring-red",
              )}
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********************************"
                className="w-full bg-transparent outline-none"
                {...register("password", { required: "Password is required" })}
              />
              <span className="absolute inset-y-0 right-5 flex items-center justify-center">
                <button type="button" onClick={togglePassword}>
                  {showPassword ? <ShowIcon /> : <HideIcon />}
                </button>
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-row items-center justify-between gap-4 text-xs text-grey-500">
            <label
              htmlFor="remember"
              className="group relative flex flex-row items-center gap-2"
            >
              <input
                type="checkbox"
                id="remember"
                className="absolute opacity-0"
                {...register("remember")}
              />
              <span className="grid size-4 place-content-center rounded-sm border border-grey-500 transition-colors group-has-[:checked]:border-transparent group-has-[:checked]:bg-purple">
                <CheckIcon className="size-3 text-transparent transition-colors group-has-[:checked]:text-white" />
              </span>
              <span>Remember me</span>
            </label>
            <Link to="/" className="text-purple">
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={!!errors.email || !!errors.password || isSubmitting}
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? <SpinnerIcon /> : <span>Sign In</span>}
        </button>
        <p className="inline-flex flex-wrap justify-center gap-1 text-sm text-grey-500">
          Don&apos;t have an account?
          <Link to="/register" className="text-purple">
            Create an account
          </Link>
          or
          <Link to="/" className="text-purple">
            Continue as a guest.
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
