/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setformError(null);
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  // put/patch
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (category) => {
    setEditId(category.id);
    setEditName(category.name);
    setEditDescription(category.description ?? "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await axiosClient.patch(`/categories/${editId}`, {
        name: editName,
        description: editDescription,
      });

      setEditId(null);
      fetchCategories();
    } catch (err) {
      alert("Failed to Update Category");
    } finally {
      setIsUpdating(false);
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are You Sure to Delete this Category?")) return;

    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to Delete this Category");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-electric-sapphire mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-text-muted">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-purity-white mb-1">Categories Management</h1>
        <p className="text-text-muted text-sm">Organize and manage your item classifications.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Create Form Card */}
      <div className="bg-surface border border-surface-border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-purity-white mb-4">Add New Category</h2>
        
        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Category Name *</label>
            <input
              type="text"
              placeholder="e.g., Electronics"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-muted">Description (Optional)</label>
            <input
              type="text"
              placeholder="Brief details about this category"
              value={formDescription}
              onChange={(e) => setformDescription(e.target.value)}
              className="w-full bg-deep-sapphire border border-surface-border rounded-lg px-3 py-2.5 text-purity-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-sapphire focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-electric-sapphire hover:bg-blue-400 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed h-[46px]"
            >
              {isSubmitting ? 'Saving...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-surface-border rounded-xl bg-surface/50">
            <p className="text-text-muted">No categories found. Start by adding one above.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-surface border border-surface-border rounded-xl p-5 flex flex-col justify-between hover:border-electric-sapphire/50 transition-colors">
              
              {editId === category.id ? (
                /* Edit State */
                <form onSubmit={handleUpdate} className="flex flex-col gap-3 h-full justify-between">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-deep-sapphire border border-surface-border rounded-md px-3 py-2 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire"
                    />
                    <textarea
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="2"
                      className="w-full bg-deep-sapphire border border-surface-border rounded-md px-3 py-2 text-sm text-purity-white focus:outline-none focus:ring-1 focus:ring-electric-sapphire resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      type="submit" 
                      disabled={isUpdating}
                      className="flex-1 bg-electric-sapphire hover:bg-blue-400 text-deep-sapphire text-sm font-semibold py-2 rounded-md transition-colors"
                    >
                      {isUpdating ? '...' : 'Save'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditId(null)}
                      className="flex-1 bg-transparent border border-surface-border hover:bg-surface-border text-purity-white text-sm font-medium py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Normal State */
                <div className="flex flex-col h-full justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-purity-white truncate" title={category.name}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-1 line-clamp-2" title={category.description}>
                      {category.description || <span className="italic opacity-50">No description provided.</span>}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2 border-t border-surface-border pt-3 mt-auto">
                    <button 
                      onClick={() => handleEditClick(category)}
                      className="px-3 py-1.5 text-xs font-medium text-electric-sapphire hover:bg-electric-sapphire/10 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Categories;