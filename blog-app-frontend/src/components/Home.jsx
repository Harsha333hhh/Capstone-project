import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  // Landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-amber-50 to-blue-100 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">
          <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6">
            B
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to BlogApp</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing articles from talented writers, or start sharing your own stories with our community.
          </p>
          <div className="flex gap-4 justify-center mb-8">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-pink-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-500 transition duration-200"
            >
              Login
            </button>
          </div>
          <p className="text-gray-500">
            Register as a User to read articles, or as an Author to publish your own content.
          </p>
        </div>
      </div>
    );
  }

  // Home page for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-amber-50 to-blue-100 flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="w-16 h-16 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6">
          B
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="text-xl text-gray-600 mb-12">
          {currentUser?.role === "author"
            ? "Share your stories with the world or read amazing articles from other writers."
            : "Explore amazing articles from talented writers in our community."}
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/articles")}
            className="w-full bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 text-lg"
          >
            📚 View Articles
          </button>

          {currentUser?.role === "author" && (
            <button
              onClick={() => navigate("/add-article")}
              className="w-full bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition duration-200 text-lg"
            >
              ✍️ Write an Article
            </button>
          )}

          <button
            onClick={() => navigate(currentUser?.role === "user" ? "/user-profile" : "/author-profile")}
            className="w-full bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 transition duration-200 text-lg"
          >
            👤 My Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
