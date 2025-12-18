import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { axiosInstance } from "../lib/axios";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { user, setUser } = useContext(userDataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className="border-b px-6 py-3"
      style={{
        background: "var(--bg)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
          EventHub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/">Events</Link>

          {user && <Link to="/dashboard">Dashboard</Link>}
          {user && (
            <Link
              to="/create"
              className="px-3 py-1 rounded text-white"
              style={{ background: "var(--primary)" }}
            >
              Create
            </Link>
          )}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded"
            style={{ background: "var(--bg-secondary)" }}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="px-3 py-1 rounded text-white"
              style={{ background: "var(--danger)" }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link
                to="/signup"
                className="px-3 py-1 rounded text-white"
                style={{ background: "var(--primary)" }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
