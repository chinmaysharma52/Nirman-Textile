import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

const API_URL = "http://localhost:5000/api";

const ProductsPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const url = categoryName 
          ? `${API_URL}/products?category=${encodeURIComponent(categoryName)}` 
          : `${API_URL}/products`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Polling error:", e);
      } finally {
        if (showLoading) setLoading(false);
      }
    };
    
    // Initial fetch with loading state
    fetchProducts(true);

    // Poll every 5 seconds to get real-time admin updates
    const interval = setInterval(() => {
      fetchProducts(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [categoryName]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {categoryName ? categoryName : "Bedsheets & linen"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {categoryName 
              ? `Browse our collection of ${categoryName}` 
              : "Browse our full collection of premium cotton bedsheets."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          No products currently available. Please check back soon!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

