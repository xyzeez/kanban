import { FC, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { isEmail } from "validator";

// Hooks
import { useAuth } from "../hooks/useAuth";

// Components
import Logo from "../components/Logo";
import { HideIcon, ShowIcon, SpinnerIcon } from "../components/Icons";

// Types
import { RegisterFormInputs } from "../types/forms";

// Utils
import { cn } from "../utils";

const Register: FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPasswords] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormInputs>();

  const togglePassword = () => {
    return setShowPasswords((prev) => !prev);
  };

  const togglePasswordConfirm = () => {
    return setShowPasswordConfirm((prev) => !prev);
  };

  const validatePassword = (value: string) => {
    if (value.length < 12)
      return "Password must be at least 12 characters long";

    if (!/[A-Z]/.test(value))
      return "Password must contain at least one uppercase letter";

    if (!/[a-z]/.test(value))
      return "Password must contain at least one lowercase letter";

    if (!/[0-9]/.test(value))
      return "Password must contain at least one number";

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      return "Password must contain at least one special character";

    return true;
  };

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const { email, password, passwordConfirm } = data;
      await registerUser({ email, password, passwordConfirm });
      reset();
      void navigate("/");
    } catch (error) {
      console.error("Registration failed");
      console.error(error);
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
              {...register("email", {
                required: "Kindly provide an email",
                validate: (value: string) =>
                  isEmail(value) || "Kindly provide a valid email",
              })}
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
                {...register("password", {
                  required: "Kindly provide a password",
                  validate: validatePassword,
                })}
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
          <div className="flex flex-col gap-2 text-grey-500">
            <label htmlFor="passwordConfirm" className="font-bold">
              Confirm Password
            </label>
            <div
              className={cn(
                "relative rounded-[4px] bg-white px-5 py-3 text-sm font-medium text-purple outline-none ring-1 ring-grey-500/25 transition-colors focus-within:ring-1 focus-within:ring-purple dark:bg-grey-800",
                errors.passwordConfirm && "ring-1 ring-red",
              )}
            >
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="passwordConfirm"
                placeholder="********************************"
                className="w-full bg-transparent outline-none"
                {...register("passwordConfirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues().password || "Passwords do not match",
                })}
              />
              <span className="absolute inset-y-0 right-5 flex items-center justify-center">
                <button type="button" onClick={togglePasswordConfirm}>
                  {showPasswordConfirm ? <ShowIcon /> : <HideIcon />}
                </button>
              </span>
            </div>
            {errors.passwordConfirm && (
              <p className="text-xs text-red">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={
            !!errors.email ||
            !!errors.password ||
            !!errors.passwordConfirm ||
            isSubmitting
          }
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? <SpinnerIcon /> : <span>Register</span>}
        </button>
        <p className="inline-flex flex-wrap justify-center gap-1 text-sm text-grey-500">
          Already have an account?
          <Link to="/login" className="text-purple">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
