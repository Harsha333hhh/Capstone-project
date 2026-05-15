import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";

function AddArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const onAddArticle = async (article) => {
    // Check if user is authenticated and is an author
    if (!isAuthenticated || !currentUser || currentUser.role !== "author") {
      setError({ message: "You must be logged in as an author to publish articles" });
      return;
    }

    setLoading(true);
    try {
      // Add status: "active" so article is immediately visible and commentable
      const articleData = { ...article, status: "active" };
      
      let res = await fetch("http://localhost:4000/article-api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(articleData),
      });

      const data = await res.json();

      if (res.status === 201) {
        navigate("/articles");
      } else {
        throw new Error(data?.message || data?.reason || "Failed to publish article. Please try again.");
      }
    } catch (err) {
      setError({ message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-orange-400 text-3xl mt-20">Publishing...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 text-3xl mt-20">{error.message}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-lg mx-4 border border-pink-700">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Add Article</h1>

        <form onSubmit={handleSubmit(onAddArticle)}>

          {/* Title — required in ArticleModel */}
          <div>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" },
                maxLength: { value: 150, message: "Title cannot exceed 150 characters" },
              })}
              placeholder="Article Title"
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category — required in ArticleModel */}
          <div className="mt-4">
            <select
              {...register("category", {
                required: "Category is required",
              })}
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Content — required in ArticleModel */}
          <div className="mt-4">
            <textarea
              {...register("content", {
                required: "Content is required",
                minLength: { value: 20, message: "Content must be at least 20 characters" },
              })}
              placeholder="Write your article content here..."
              rows={6}
              className="border border-pink-700 rounded-lg w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
            {errors.content && (
              <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200 mt-4"
          >
            Publish Article
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArticle;