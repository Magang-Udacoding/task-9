/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import axiosClient from "../api/axiosClient";

function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriesResponse] = await Promise.all([
        axiosClient.get("/items"),
        axiosClient.get("/categories"),
      ]);

      setItems(itemsResponse.data.data);
      setCategories(categoriesResponse.data.data);
    } catch (error) {
      setError("Failed to Get Items/Categories");
    } finally {
      setLoading(false);
    }
  };

  // post
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStock, setFormStock] = useState(0);
  const [formError, setFormError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formCategoryId) {
      setFormError("Silakan pilih kategori terlebih dahulu!");
      return;
    }

    try {
      await axiosClient.post("/items", {
        name: formName,
        category_id: formCategoryId,
        description: formDescription,
        stock: formStock,
      });

      // Reset form
      setFormName("");
      setFormCategoryId("");
      setFormDescription("");
      setFormStock(0);

      fetchData();
    } catch (err) {
      setFormError("Failed to Add Item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are You Sure to Delete this Item?")) return;

    try {
      await axiosClient.delete(`/items/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to Delete this Item");
    }
  };

  // put/patch
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStock, setEditStock] = useState(0);

  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditCategoryId(item.category_id);
    setEditDescription(item.description ?? "");
    setEditStock(item.stock ?? 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.patch(`/items/${editId}`, {
        name: editName,
        category_id: editCategoryId,
        description: editDescription,
        stock: editStock,
      });

      setEditId(null);
      fetchData(); // Refresh data
    } catch (err) {
      alert("Failed to Update Item");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Load Data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Items (Inventaris)</h2>
      <button onClick={logout}>Logout</button>

      {/* post form */}
      {formError && <p style={{ color: "red" }}>{formError}</p>}

      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Item Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          required
        />

        {/* Dropdown Kategori */}
        <select
          value={formCategoryId}
          onChange={(e) => setFormCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>
            Choose Category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description (opt)"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={formStock}
          onChange={(e) => setFormStock(e.target.value)}
          min="0"
        />

        <button type="submit">Add Item</button>
      </form>

      <h3>Daftar Barang</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "10px" }}>
            {editId === item.id ? (
              // -- Form Edit --
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />

                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Desc (opt)"
                />

                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  min="0"
                  style={{ width: "60px" }}
                />

                <button type="submit" style={{ marginLeft: "5px" }}>
                  Save
                </button>
                <button type="button" onClick={() => setEditId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              // -- Tampilan Normal --
              <>
                <strong>{item.name}</strong>
                <span style={{ color: "gray" }}>
                  ({item.category ? item.category.name : "Tanpa Kategori"})
                </span>
                <br />
                <span>Stok: {item.stock}</span>
                {item.description && <div>Desc: {item.description}</div>}

                <div style={{ marginTop: "5px" }}>
                  <button
                    onClick={() => handleEditClick(item)}
                    style={{ marginRight: "5px" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Items;
