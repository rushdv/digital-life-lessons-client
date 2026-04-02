import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const Register = () => {
  const { register: createUser, googleLogin: googleSignIn, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const saveUserToDB = async (user) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
    });
  };

  const onSubmit = async (data) => {
    try {
      const result = await createUser(data.email, data.password);
      await updateUserProfile(data.name, data.photoURL);
      await saveUserToDB({
        displayName: data.name,
        email: data.email,
        photoURL: data.photoURL,
      });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(
        err.message.includes("email-already-in-use")
          ? "Email already in use."
          : "Registration failed. Try again."
      );
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await googleSignIn();
      await saveUserToDB(result.user);
      toast.success("Registered with Google!");
      navigate("/");
    } catch {
      toast.error("Google sign-up failed.");
    }
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: { value: 6, message: "At least 6 characters required" },
    validate: {
      hasUpper: (v) => /[A-Z]/.test(v) || "Must contain an uppercase letter",
      hasLower: (v) => /[a-z]/.test(v) || "Must contain a lowercase letter",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">📖</span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Start preserving your life lessons</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("photoURL")}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Min 6 chars, upper & lowercase"
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                {...register("password", passwordValidation)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-gray-400 text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="mx-3 text-xs text-gray-400">OR</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;