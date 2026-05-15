import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);
  const clearError = useAuth((state) => state.clearError);
  const navigate = useNavigate();

  const onUserLogin = async (userCred) => {
    console.log("Login attempted with credentials:", userCred);
    await login(userCred);
  };

  // Redirect when authenticated
  useEffect(() => {
    console.log("Checking auth state - isAuthenticated:", isAuthenticated, "currentUser:", currentUser);
    
    if (isAuthenticated && currentUser) {
      console.log("User authenticated, role:", currentUser.role);
      
      if (currentUser.role === "user") {
        console.log("Navigating to user-profile");
        navigate("/user-profile", { replace: true });
      } else if (currentUser.role === "author") {
        console.log("Navigating to author-profile");
        navigate("/author-profile", { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, []);

  // Show loading state while logging in
  if (loading) {
    return <p className="text-center text-orange-400 text-3xl mt-20">Logging in...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-md mx-4 border border-pink-700">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="ml-2 font-bold text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>

          {/* Role Selection */}
          <div className="mb-3">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 font-medium">Select Role:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="user"
                  {...register("role", { required: "Please select a role" })}
                  className="accent-blue-400 w-4 h-4"
                  defaultChecked
                />
                <span>User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="author"
                  {...register("role", { required: "Please select a role" })}
                  className="accent-blue-400 w-4 h-4"
                />
                <span>Author</span>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Email — must match a registered email in UserModel */}
          <div>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Email"
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password - required in UserModel */}
          <div className="mt-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Password"
                className="border border-pink-700 rounded-lg w-full px-3 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200 mt-6"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;