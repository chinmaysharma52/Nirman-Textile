import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Product } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.imageUrl);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (res.ok) setProducts(data);
  };

  const loadCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if (res.ok) setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        setNewCategoryName("");
        setShowAddCategory(false);
        await loadCategories();
        setCategory(newCategoryName); 
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add category");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageUrl("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = { title, price: Number(price), category, description, imageUrl };
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_URL}/products/${editing._id}`
      : `${API_URL}/products`;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    await loadProducts();
    setSuccessMsg(editing ? "Product updated successfully!" : "Product added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setTitle(product.title);
    setPrice(product.price);
    setCategory(product.category || "");
    setDescription(product.description);
    setImageUrl(product.imageUrl);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await loadProducts();
  };

  return (
    <div className="grid lg:grid-cols-[1fr,2fr] gap-10">
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary pb-2 border-b border-black/5">
          {editing ? "Edit Product" : "New Product"}
        </h1>
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 text-sm font-medium">
            {successMsg}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm space-y-4 text-xs"
        >
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Price (₹)
          </label>
          <input
            type="number"
            min={0}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {uploading && <p className="text-xs text-accent mt-1">Uploading...</p>}
          {imageUrl && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Image Preview:</p>
              <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-black/5 shadow-sm" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <label className="font-medium text-slate-700 flex items-center justify-between">
            <span>Category</span>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + Add Category
            </button>
          </label>
          {showAddCategory && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="text"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 rounded-md border border-slate-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-primary text-white px-3 py-1 rounded-md font-medium text-xs hover:bg-black transition-colors"
              >
                Add
              </button>
            </div>
          )}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
            {/* Fallback for existing categories not in DB */}
            {category && !categories.find(c => c.name === category) && (
              <option value={category}>{category}</option>
            )}
          </select>
        </div>
        <div className="space-y-1">
          <label className="font-medium text-slate-700">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="inline-flex px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm hover:bg-black transition-all transform hover:-translate-y-0.5"
          >
            {editing ? "Update product" : "Save product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary pb-2 border-b border-black/5">
          Inventory
        </h2>
        <div className="space-y-4 text-xs">
          {products.map((p: Product) => (
            <div
              key={p._id}
              className="flex items-center gap-5 bg-white border border-black/5 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-base font-semibold text-primary line-clamp-1">
                  {p.title}
                </p>
                {p.category && p.category !== "Uncategorized" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 mb-1">
                    {p.category}
                  </span>
                )}
                <p className="text-[12px] text-slate-500 line-clamp-2">
                  {p.description}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-base font-bold text-primary">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-xs font-semibold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-xs text-slate-500">
              No products yet. Use the form to add your first bedsheet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;

