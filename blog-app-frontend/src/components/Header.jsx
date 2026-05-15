import { NavLink } from "react-router-dom";
import { useAuth } from "../../authStore";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const isAuthor = isAuthenticated && currentUser && currentUser.role === "author";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-pink-200 shadow-md border-b-2 border-pink-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <span className="text-xl font-bold text-gray-700 tracking-tight">BlogApp</span>
        </div>

        {/* Nav links on the right */}
        <nav className="flex items-center gap-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-semibold border-b-2 border-blue-400 pb-0.5"
                : "text-gray-600 hover:text-blue-400 font-medium transition duration-150"
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/articles"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500 font-semibold border-b-2 border-blue-400 pb-0.5"
                  : "text-gray-600 hover:text-blue-400 font-medium transition duration-150"
              }
            >
              Articles
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-semibold border-b-2 border-blue-400 pb-0.5"
                    : "text-gray-600 hover:text-blue-400 font-medium transition duration-150"
                }
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-500 font-semibold border-b-2 border-blue-400 pb-0.5"
                    : "text-gray-600 hover:text-blue-400 font-medium transition duration-150"
                }
              >
                Login
              </NavLink>
            </>
          ) : null}

          {isAuthor && (
            <NavLink
              to="/add-article"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold"
                  : "bg-blue-400 text-white px-4 py-1.5 rounded-lg hover:bg-blue-500 font-medium transition duration-150"
              }
            >
              Add Article
            </NavLink>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-400 text-white px-4 py-1.5 rounded-lg hover:bg-red-500 font-medium transition duration-150"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;