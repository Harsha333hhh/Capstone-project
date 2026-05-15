import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../authStore";

function ArticleDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const { articleId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  // Check if user is authenticated - if not, redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:4000/article-api/articles");
        const data = await res.json();

        if (res.status === 200) {
          const foundArticle = data.payload.find((a) => a._id === articleId);
          if (foundArticle) {
            setArticle(foundArticle);
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

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      alert("Please write a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      console.log('=== SUBMITTING COMMENT ===');
      console.log('Article ID:', articleId);
      console.log('Comment text:', commentText);
      console.log('Current user:', currentUser);
      
      const res = await fetch(`http://localhost:4000/article-api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: commentText }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.status === 201) {
        console.log('Comment added successfully!');
        setArticle(data.payload);
        setCommentText("");
        alert("Comment added successfully!");
      } else {
        console.error('Backend error:', data);
        alert(data?.message || data?.reason || "Failed to add comment");
      }
    } catch (err) {
      console.error('=== COMMENT ERROR ===');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert("Error adding comment: " + err.message);
    } finally {
      setSubmittingComment(false);
      console.log('=== COMMENT ATTEMPT COMPLETE ===');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const res = await fetch(`http://localhost:4000/article-api/articles/${articleId}/comments/${commentId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.status === 200) {
          const data = await res.json();
          setArticle(data.payload);
        } else {
          const data = await res.json();
          alert(data?.message || "Failed to delete comment");
        }
      } catch (err) {
        alert("Error deleting comment: " + err.message);
      }
    }
  };

  const handleEditCommentStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.comment);
  };

  const handleEditCommentCancel = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleEditCommentSave = async (commentId) => {
    if (!editingCommentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/article-api/articles/${articleId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: editingCommentText }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setArticle(data.payload);
        setEditingCommentId(null);
        setEditingCommentText("");
      } else {
        const data = await res.json();
        alert(data?.message || "Failed to update comment");
      }
    } catch (err) {
      alert("Error updating comment: " + err.message);
    }
  };

  const handleDeleteArticle = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await fetch(`http://localhost:4000/article-api/articles/${articleId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.status === 200) {
          navigate("/articles");
        } else {
          const data = await res.json();
          alert(data?.message || "Failed to delete article");
        }
      } catch (err) {
        alert("Error deleting article: " + err.message);
      }
    }
  };

  const isArticleAuthor = () => {
    return currentUser && currentUser._id === article?.author;
  };

  const isCommentAuthor = (commentUserId) => {
    return currentUser && currentUser._id === commentUserId;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-center text-orange-400 text-3xl">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="bg-pink-100 p-8 rounded-xl shadow-md w-full max-w-2xl mx-4 border border-pink-700">
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

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/articles")}
          className="mb-6 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 font-semibold"
        >
          ← Back to Articles
        </button>

        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{article?.title}</h1>

          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                article?.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {article?.status}
            </span>
            <span className="text-gray-500">
              📅 {new Date(article?.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-500">
              🏷️ <span className="font-semibold capitalize text-blue-600">{article?.category}</span>
            </span>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{article?.content}</p>
          </div>

          {/* Edit and Delete buttons for article author */}
          {isArticleAuthor() && (
            <div className="flex gap-3 pt-6 pb-6 border-b border-gray-200">
              <button
                onClick={() => navigate(`/edit-article/${article?._id}`)}
                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
              >
                ✏️ Edit Article
              </button>
              <button
                onClick={handleDeleteArticle}
                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
              >
                🗑️ Delete Article
              </button>
            </div>
          )}

          {/* Add Comment Form */}
          <div className="mb-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a Comment</h2>
            <form onSubmit={handleAddComment} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="4"
                disabled={submittingComment}
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold disabled:bg-gray-400"
              >
                {submittingComment ? "Adding..." : "Add Comment"}
              </button>
            </form>
          </div>

          {/* Comments Section */}
          {article?.comments && article.comments.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Comments ({article.comments.length})
              </h2>
              <div className="space-y-4">
                {article.comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {editingCommentId === comment._id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <textarea
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCommentSave(comment._id)}
                            className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleEditCommentCancel}
                            className="flex-1 bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition duration-200 font-semibold text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-gray-800">
                            {typeof comment.user === "object" ? comment.user.name : "Anonymous User"}
                          </p>
                          {isCommentAuthor(comment.user?._id || comment.user) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCommentStart(comment)}
                                className="text-sm bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-500 transition duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-sm bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 transition duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{comment.comment}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}{" "}
                          {comment.updatedAt && comment.createdAt !== comment.updatedAt && "(edited)"}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Comments Message */}
          {(!article?.comments || article.comments.length === 0) && (
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
