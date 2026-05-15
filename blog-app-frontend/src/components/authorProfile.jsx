import React from 'react'
import { useAuth } from '../../authStore'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { API_BASE_URL } from '../config/api.js'

function authorProfile() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use refs for password inputs to prevent values from being stored in DOM
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Fetch author's articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/author-api/articles`, {
        credentials: "include"
      });
      
      if (res.status === 200) {
        const data = await res.json();
        setArticles(data.payload || []);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const oldPassword = oldPasswordRef.current?.value || '';
    const newPassword = newPasswordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/common-api/change-password/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await res.json();

      if (res.status === 200) {
        setPasswordSuccess("Password changed successfully!");
        // Clear all password inputs
        oldPasswordRef.current.value = '';
        newPasswordRef.current.value = '';
        confirmPasswordRef.current.value = '';
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Error changing password: " + err.message);
    }
  };

  // Perform logout and navigate to login
  const onLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Load articles on component mount
  useEffect(() => {
    if (currentUser) {
      fetchArticles();
    }
  }, [currentUser]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!currentUser) {
      console.log("User not authenticated, redirecting to home");
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-center text-orange-400 text-3xl">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Author Profile</h1>
          <p className="text-gray-600 text-lg mb-2"><strong>Name:</strong> {currentUser.name}</p>
          <p className="text-gray-600 text-lg mb-6"><strong>Email:</strong> {currentUser.email}</p>
          
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/add-article')} 
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
            >
              Write New Article
            </button>
            <button 
              onClick={() => fetchArticles()} 
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-semibold"
            >
              Refresh Articles
            </button>
            <button 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition duration-200 font-semibold"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
            <button 
              onClick={onLogout} 
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
            
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Old Password</label>
                <div className="relative">
                  <input 
                    ref={oldPasswordRef}
                    type={showOldPassword ? "text" : "password"} 
                    placeholder="Enter your current password"
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showOldPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                <div className="relative">
                  <input 
                    ref={newPasswordRef}
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Enter your new password"
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showNewPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
                <div className="relative">
                  <input 
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your new password"
                    className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-200 font-semibold"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* Articles Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Articles</h2>
          
          {loading && <p className="text-center text-orange-400 text-lg">Loading articles...</p>}
          
          {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}
          
          {!loading && !error && articles.length === 0 && (
            <p className="text-center text-gray-500 text-lg">No articles yet. <button onClick={() => navigate('/add-article')} className="text-blue-500 hover:underline">Create your first article</button></p>
          )}
          
          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div 
                  key={article._id} 
                  className="border border-pink-200 p-4 rounded-lg hover:shadow-lg transition duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Category: <span className="font-semibold text-blue-500 capitalize">{article.category}</span>
                  </p>
                  <p className="text-gray-600 line-clamp-2 mb-3">{article.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      article.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/article/${article._id}`)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition duration-200"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => navigate(`/edit-article/${article._id}`)}
                      className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default authorProfile