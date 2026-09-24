import { Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { token, logout } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Fungsi kecil untuk mengecek apakah link sedang aktif
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-deep-sapphire flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-surface border-b border-surface-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section: Brand & Navigation */}
            <div className="flex items-center gap-8">
              {/* Brand Logo / Name */}
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-purity-white tracking-wide">
                  Inventaris<span className="text-electric-sapphire">App</span>
                </span>
              </div>

              {/* Navigation Links (Desktop & Tablet) */}
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  to="/items" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/items') 
                      ? 'bg-electric-sapphire/10 text-electric-sapphire' 
                      : 'text-text-muted hover:text-purity-white hover:bg-surface-border'
                  }`}
                >
                  Items
                </Link>
                <Link 
                  to="/categories" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/categories') 
                      ? 'bg-electric-sapphire/10 text-electric-sapphire' 
                      : 'text-text-muted hover:text-purity-white hover:bg-surface-border'
                  }`}
                >
                  Kategori
                </Link>
              </div>
            </div>

            {/* Right Section: Logout */}
            <div>
              <button 
                onClick={logout} 
                className="px-4 py-2 text-sm font-medium text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-purity-white transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-surface"
              >
                Logout
              </button>
            </div>

          </div>
          
          {/* Mobile Navigation (Visible only on small screens) */}
          <div className="sm:hidden flex items-center gap-2 pb-3 overflow-x-auto border-t border-surface-border pt-3">
            <Link 
              to="/items" 
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/items') 
                  ? 'bg-electric-sapphire/10 text-electric-sapphire' 
                  : 'text-text-muted hover:text-purity-white hover:bg-surface-border'
              }`}
            >
              Items
            </Link>
            <Link 
              to="/categories" 
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/categories') 
                  ? 'bg-electric-sapphire/10 text-electric-sapphire' 
                  : 'text-text-muted hover:text-purity-white hover:bg-surface-border'
              }`}
            >
              Kategori
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default PrivateRoute;