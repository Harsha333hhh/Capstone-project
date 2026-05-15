import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../authStore";

function EditArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(null);
  let [saveLoading, setSaveLoading] = useState(false);
  let [articleStatus, setArticleStatus] = useState("active");

  let navigate = useNavigate();
  const { articleId } = useParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  // Fetch article data on mount
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/article-api/articles`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.status === 200) {
          // Find the article by ID
          const article = data.payload.find((a) => a._id === articleId);
          if (article) {
            // Check if current user is the author
            if (currentUser && currentUser._id !== article.author) {
              setError("You are not authorized to edit this article");
              return;
            }
            // Populate form with article data
            setValue("title", article.title);
            setValue("category", article.category);
            setValue("content", article.content);
            setArticleStatus(article.status || "active");
          } else {
            setError("Article not found");
          }
        } else {
          setError("Failed to fetch article");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && currentUser && articleId) {
      fetchArticle();
    }
  }, [articleId, currentUser, isAuthenticated, setValue]);

  const onUpdateArticle = async (article) => {
    setSaveLoading(true);
    try {
      // Preserve the status when updating
      const articleData = { ...article, status: articleStatus };
      
      let res = await fetch(`http://localhost:4000/article-api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(articleData),
      });

      const data = await res.json();

      if (res.status === 200) {
        navigate("/articles");
      } else {
        throw new Error(data?.message || data?.reason || "Failed to update article");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-orange-400 text-3xl mt-20">Loading article...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-lg mx-4 border border-pink-700">
          <p className="text-center text-red-600 text-2xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/articles")}
            className="w-full bg-blue-400 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  if (saveLoading) {
    return <p className="text-center text-orange-400 text-3xl mt-20">Updating...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-lg mx-4 border border-pink-700">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Edit Article</h1>

        <form onSubmit={handleSubmit(onUpdateArticle)}>
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
            Update Article
          </button>
        </form>

        <button
          onClick={() => navigate("/articles")}
          className="w-full bg-gray-400 text-white font-semibold py-2 rounded-lg hover:bg-gray-500 transition duration-200 mt-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditArticle;
