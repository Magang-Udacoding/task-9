import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/categories");
      setCategories(response.data.data);
    } catch (err) {
      setError("Failed to Get Categories Data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // post
  const [formName, setFormName] = useState("");
  const [formDescription, setformDescription] = useState("");
  const [formError, setformError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setformError(null);

    try {
      await axiosClient.post("/categories", {
        name: formName,
        description: formDescription,
      });

      setFormName("");
      setformDescription("");
      fetchCategories();
    } catch (err) {
      setformError("Failed to Add Categories");
    }
  };

  //   put/patch
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleEditClick = (category) => {
    setEditId(category.id);
    setEditName(category.name);
    setEditDescription(category.description ?? "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.patch(`/categories/${editId}`, {
        name: editName,
        description: editDescription,
      });

      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert("Failed to Update Category");
    }
  };

  //   delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are You Sure to Delete this Category?")) return;

    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to Delete this Category");
    }
  };

  if (loading) return <p>Load Data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Categories</h2>
      <button onClick={logout}> Logout </button>
      {formError && <p style={{ color: "red" }}>{formError}</p>}

      <form onSubmit={handleCreate}>
        {/* Category - Name */}
        <input
          type="text"
          placeholder="Category Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          required
        />

        {/* Category - Description */}
        <input
          type="text"
          placeholder="Description (opt)"
          value={formDescription}
          onChange={(e) => setformDescription(e.target.value)}
        />

        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {editId === category.id ? (
              // update form
              <form onSubmit={handleUpdate}>
                {/* Category - Name */}
                <input
                  type="text"
                  placeholder="Category Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />

                {/* Category - Description */}
                <input
                  type="text"
                  placeholder="Description (opt)"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{category.name}</strong>
                {category.description && <span> -{category.description}</span>}
                <button onClick={() => handleEditClick(category)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;