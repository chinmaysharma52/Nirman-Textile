import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-xs text-slate-500">Loading product…</p>;
  }

  if (!product) {
    return (
      <p className="text-xs text-slate-500">
        Product not found. It may have been removed.
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          {product.title}
        </h1>
        <p className="text-sm text-slate-600 whitespace-pre-line">
          {product.description}
        </p>
        <div className="pt-2 flex items-center gap-3">
          <p className="text-2xl font-semibold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500">
            Inclusive of all taxes · Cash on Delivery available
          </p>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-primary"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

