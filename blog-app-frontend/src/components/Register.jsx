import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../authStore";

function Register() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let navigate = useNavigate();
  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  // Watch for successful login and redirect
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === "user") {
        navigate("/user-profile");
      } else if (currentUser.role === "author") {
        navigate("/author-profile");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const onUserRegister = async (newUser) => {
    setLoading(true);
    setError(null);
    console.log("Registering user:", newUser);
    try {
      let { role } = newUser;
      let user = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };
      let res;
      
      if (role === "user" || role === "USER") {
        //make req to user api
        res = await axios.post("http://localhost:4000/user-api/users", user);
        console.log("User registration response:", res);
      } else if (role === "author" || role === "AUTHOR") {
        //make req to author api
        res = await axios.post("http://localhost:4000/author-api/users", user);
        console.log("Author registration response:", res);
      }

      if (res.status === 201) {
        // Auto-login the user after successful registration
        const loginCredentials = {
          email: newUser.email,
          password: newUser.password,
          role: role.toLowerCase()
        };
        await login(loginCredentials);
      }
    } catch (err) {
      setError(err?.response?.data?.reason || err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
if(loading===true){
return <p className="text-center text-orange-400 text-3xl mt-20">Loading...</p>;
}
if(error){
  return <p className="text-center text-red-400 text-3xl mt-20">{error}</p>;
}
  //const onRegister = async (newUser) => {
    //setLoading(true);
    //try {
      //let res = await fetch("http://localhost:4000/user-api/users/register", {
       // method: "POST",
        //headers: { "Content-Type": "application/json" },
        //body: JSON.stringify(newUser),
      //});

//      if (res.status === 201) {
  //      navigate("/login");
    //  } else {
      //  throw new Error("Registration failed. Please try again.");
      //}
    //} catch (err) {
     // setError(err);
    //} finally {
    //  setLoading(false);
    //}
 // };

  //if (loading) {
   // return <p className="text-center text-orange-400 text-3xl mt-20">Loading...</p>;
  //}

  //if (error) {
   // return <p className="text-center text-red-400 text-3xl mt-20">{error.message}</p>;
  //}

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-md mx-4 border border-pink-600">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Register</h1>

        <form onSubmit={handleSubmit(onUserRegister)}>

          {/* Role Selection */}
          <div className="mb-1">
            <div className="flex items-center gap-6">
              <span className="text-gray-600 font-medium">Select Role:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", { required: "Please select a role" })}
                  className="accent-blue-400 w-4 h-4"
                  defaultChecked
                />
                <span>User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
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

          {/* First & Last Name */}
          <div className="flex gap-3 mt-4">
            <div className="flex-1">
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 50, message: "Max 50 characters" },
                })}
                placeholder="Name"
                className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="flex-1">
              {/* lastName is optional in UserModel */}
              <input
                type="text"
                {...register("lastName", {
                  maxLength: { value: 50, message: "Max 50 characters" },
                })}
                placeholder="Last name (optional)"
                className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
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
              <p className="text-red-400 text-xs mt-1 border ">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-4">
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
                maxLength: { value: 100, message: "Password too long" },
              })}
              placeholder="Password"
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Profile Image (optional - stored as URL in model) */}
          <div className="mt-4">
            <input
              type="file"
              {...register("profileImage")}
              accept="image/*"
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-500 focus:outline-none"
            />
            <p className="text-black text-xs mt-1">Profile image is optional</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200 mt-6"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;