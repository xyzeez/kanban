import { FC, useState } from "react";
import { Link, Navigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";

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
interface Inputs {
  email: string;
  password: string;
  remember: boolean;
}

const Login: FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPasswords] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Inputs>();

  const togglePassword = () => {
    return setShowPasswords((prev) => !prev);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const { email, password, remember } = data;
      await login(email, password, remember);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <main className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-96 flex-col gap-8 font-sans text-black transition-colors dark:text-grey-500"
      >
        <Logo full={true} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@example.com"
              className="rounded-3xl bg-white px-5 py-3 text-purple outline-none ring-purple transition-colors focus:ring-1 dark:bg-grey-800"
              {...register("email", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div className="relative rounded-3xl bg-white px-5 py-3 text-purple outline-none ring-purple transition-colors focus-within:ring-1 dark:bg-grey-800">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********************************"
                className="w-full bg-transparent outline-none"
                {...register("password", { required: true })}
              />
              <span className="absolute inset-y-0 right-5 flex items-center justify-center">
                <button type="button" onClick={togglePassword}>
                  {showPassword && <ShowIcon className="h-3 w-5" />}
                  {!showPassword && <HideIcon className="h-4 w-5" />}
                </button>
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-4 text-xs">
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
                <CheckIcon className="ml-[2px] mt-[2px] h-[10px] w-3 text-transparent transition-colors group-has-[:checked]:text-white" />
              </span>
              <span>Remember me</span>
            </label>
            <Link to="/" className="text-purple">
              Forgot Password?
            </Link>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-large">
          {isSubmitting ? <SpinnerIcon /> : <span>Sign In</span>}
        </button>
        <p className="inline-flex flex-wrap justify-center gap-1 text-sm">
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
