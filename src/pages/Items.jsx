/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formCategoryId) {
      setFormError("Silakan pilih kategori terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditCategoryId(item.category_id);
    setEditDescription(item.description ?? "");
    setEditStock(item.stock ?? 0);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await axiosClient.patch(`/items/${editId}`, {
        name: editName,
        category_id: editCategoryId,
        description: editDescription,
        stock: editStock,
      });

      setEditId(null);
      fetchData(); 
    } catch (err) {
      alert("Failed to Update Item");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-electric-sapphire mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-text-muted">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-purity-white mb-1">Inventory Items</h1>
        <p className="text-text-muted text-sm">Manage your stock, add new items, and organize them into categories.</p>
      </div>

      {(error || formError) && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error || formError}
        </div>
      )}

      {/* Create Form Card */}
      <div className="bg-surface border border-surface-border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-purity-white mb-4">Add New Item</h2>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Item Name *</label>
            <input
              type="text"
              placeholder="e.g., MacBook Pro"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Category *</label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            >
              <option value="" disabled>Choose Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Description (Optional)</label>
            <input
              type="text"
              placeholder="Brief details"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Stock</label>
            <input
              type="number"
              placeholder="0"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              min="0"
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-electric-sapphire hover:bg-blue-400 text-deep-sapphire font-bold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed h-[46px]"
            >
              {isSubmitting ? 'Saving...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-surface border border-surface-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-border/30">
                <th className="px-5 py-3 border-b border-surface-border text-sm font-semibold text-purity-white">Name</th>
                <th className="px-5 py-3 border-b border-surface-border text-sm font-semibold text-purity-white">Category</th>
                <th className="px-5 py-3 border-b border-surface-border text-sm font-semibold text-purity-white">Stock</th>
                <th className="px-5 py-3 border-b border-surface-border text-sm font-semibold text-purity-white">Description</th>
                <th className="px-5 py-3 border-b border-surface-border text-sm font-semibold text-purity-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-text-muted">
                    No items found in inventory.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  editId === item.id ? (
                    /* Edit Row */
                    <tr key={item.id} className="bg-electric-sapphire/5 border-b border-surface-border">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                          className="w-full bg-deep-sapphire border border-surface-border rounded px-2 py-1.5 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editCategoryId}
                          onChange={(e) => setEditCategoryId(e.target.value)}
                          required
                          className="w-full bg-deep-sapphire border border-surface-border rounded px-2 py-1.5 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire"
                        >
                          <option value="" disabled>Choose...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          min="0"
                          className="w-20 bg-deep-sapphire border border-surface-border rounded px-2 py-1.5 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Desc (opt)"
                          className="w-full bg-deep-sapphire border border-surface-border rounded px-2 py-1.5 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire"
                        />
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <button 
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-xs font-medium bg-electric-sapphire text-deep-sapphire rounded-md transition-colors mr-2 disabled:opacity-70"
                        >
                          {isUpdating ? '...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => setEditId(null)}
                          className="px-3 py-1.5 text-xs font-medium border border-surface-border hover:bg-surface-border text-purity-white rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    /* Normal Row */
                    <tr key={item.id} className="border-b border-surface-border hover:bg-surface-border/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-purity-white">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {item.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-border text-purity-white">
                            {item.category.name}
                          </span>
                        ) : (
                          <span className="italic opacity-50">Tanpa Kategori</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`font-medium ${item.stock <= 5 ? 'text-vivid-lemon' : 'text-purity-white'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted max-w-[200px] truncate" title={item.description}>
                        {item.description || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="px-3 py-1.5 text-xs font-medium text-electric-sapphire hover:bg-electric-sapphire/10 rounded-md transition-colors mr-2"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Items;