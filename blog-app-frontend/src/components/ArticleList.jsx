import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";
import { API_BASE_URL } from "../config/api.js";

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/article-api/articles/${articleId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.status === 200) {
          // Remove article from state
          setArticles(articles.filter((article) => article._id !== articleId));
        } else {
          const data = await res.json();
          alert(data?.message || "Failed to delete article");
        }
      } catch (err) {
        alert("Error deleting article: " + err.message);
      }
    }
  };

  const isArticleAuthor = (articleAuthorId) => {
    return currentUser && currentUser._id === articleAuthorId;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/article-api/articles`);
        const data = await res.json();

        if (res.status === 200) {
          setArticles(data.payload || []);
        } else {
          throw new Error(data?.message || "Failed to fetch articles");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-center text-orange-400 text-3xl">Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-center text-red-400 text-3xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-8 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200 font-semibold"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Latest Articles</h1>

        {articles.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No articles available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-pink-200 cursor-pointer group"
                onClick={() => navigate(`/article/${article._id}`)}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition duration-200">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 mb-3">
                  Category: <span className="font-semibold text-blue-500 capitalize">{article.category}</span>
                </p>
                <p className="text-gray-600 line-clamp-3 mb-4">{article.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      article.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {article.status}
                  </span>
                </div>

                {/* Edit and Delete buttons for article author */}
                {isArticleAuthor(article.author) && (
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/edit-article/${article._id}`)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-200 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article._id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-200 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleList;
