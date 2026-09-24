import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { token, logout } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div>
      <nav
        style={{
          padding: "15px",
          backgroundColor: "#f4f4f4",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <strong>Inventaris App</strong>
        <span style={{ margin: "0 20px" }}>|</span>

        {/* Link dari React Router mencegah halaman reload */}
        <Link to="/items" style={{ marginRight: "15px" }}>
          Items
        </Link>
        <Link to="/categories" style={{ marginRight: "15px" }}>
          Kategori
        </Link>

        <button onClick={logout} style={{ float: "right" }}>
          Logout
        </button>
      </nav>
      {/* Menampilkan isi spesifik dari halaman (Items / Categories) */}
      <div style={{ padding: "10px" }}>{children}</div>
    </div>
  );
}

export default PrivateRoute;
