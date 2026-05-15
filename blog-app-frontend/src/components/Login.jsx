import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";
function Login() {
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
    await login(userCred);
    console.log("Login attempted with credentials:", userCred);
  };

  // Clear error on component mount and when user tries to login again
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    console.log("Auth:", isAuthenticated);
    console.log("User:", currentUser);

    if (isAuthenticated && currentUser) {
      if (currentUser.role === "user") {
        navigate("/user-profile");
      } else if (currentUser.role === "author") {
        navigate("/author-profile");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

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
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              placeholder="Password"
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
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