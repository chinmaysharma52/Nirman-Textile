import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

const API_URL = "http://localhost:5000/api";

const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchProducts = async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setFeatured(data.slice(0, 4));
      } catch (e) {
        console.error("Polling error:", e);
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      } finally {
        setLoadingCategories(false);
      }
    };

    // Initial fetch with loading state
    fetchProducts(true);
    fetchCategories();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchProducts(false);
      fetchCategories();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 py-8 animate-fade-in">
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-accent/20 text-accent-hover px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            New collection · Summer cotton
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Premium cotton bedsheets for{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              dreamy comfort
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Discover handpicked designs crafted with soft, breathable cotton.
            Perfect drape, rich colors, and long-lasting comfort for every
            bedroom in your home.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-900/30 hover:to-indigo-500 hover:-translate-y-0.5 transition-all outline-none"
            >
              Shop bedsheets
            </Link>
            <a
              href="#featured"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900 shadow-sm transition-all hover:-translate-y-0.5"
            >
              View featured designs
            </a>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">
                100% Cotton Fabrics
              </p>
              <p>Soft touch, breathable comfort</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Free shipping</p>
              <p>On orders above ₹999</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Cash on Delivery
              </p>
              <p>Pay when the order arrives</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent blur-3xl rounded-full" />
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="aspect-[4/3] bg-beige relative">
              <img
                src="https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Stack of colorful cotton bedsheets"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Nirman Signature
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Jaipur Handblock Collection
                </p>
              </div>
              <p className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                New arrival
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore our wide range of collections.
            </p>
          </div>
        </div>
        
        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : categories.length === 0 ? null : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                  <img
                    src={cat.imageUrl || "https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 drop-shadow-md transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/90 font-medium tracking-wide pb-1">
                    {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="featured" className="space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Featured bedsheets
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated picks from our most-loved designs.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            View all collection &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-slate-500 bg-slate-50 p-8 rounded-2xl text-center border border-dashed border-slate-200">
            No products available at the moment. Please check back later!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

