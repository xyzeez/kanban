import { FC, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";

// Hooks
import { useAuth } from "../hooks/useAuth";

// Components
import Logo from "../components/Logo";
import { HideIcon, ShowIcon, SpinnerIcon } from "../components/Icons";

// Types
import { RegisterFormInputs } from "../types/forms";

const Register: FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPasswords] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RegisterFormInputs>();

  const togglePassword = () => {
    return setShowPasswords((prev) => !prev);
  };

  const togglePasswordConfirm = () => {
    return setShowPasswordConfirm((prev) => !prev);
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
          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirm" className="font-bold">
              Confirm Password
            </label>
            <div className="relative rounded-3xl bg-white px-5 py-3 text-purple outline-none ring-purple transition-colors focus-within:ring-1 dark:bg-grey-800">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="passwordConfirm"
                placeholder="********************************"
                className="w-full bg-transparent outline-none"
                {...register("passwordConfirm", { required: true })}
              />
              <span className="absolute inset-y-0 right-5 flex items-center justify-center">
                <button type="button" onClick={togglePasswordConfirm}>
                  {showPasswordConfirm && <ShowIcon className="h-3 w-5" />}
                  {!showPasswordConfirm && <HideIcon className="h-4 w-5" />}
                </button>
              </span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-large"
        >
          {isSubmitting ? <SpinnerIcon /> : <span>Register</span>}
        </button>
        <p className="inline-flex flex-wrap justify-center gap-1 text-sm">
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
