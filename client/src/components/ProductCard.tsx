import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/10 shadow-sm border border-indigo-50 flex flex-col relative animate-fade-in-up">
      <Link to={`/products/${product._id}`} className="block overflow-hidden relative">
        <div className="aspect-[4/3] bg-indigo-50/50 relative overflow-hidden">
          <img
            loading="lazy"
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-indigo-900/10 transition-colors duration-500" />
          <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-100 to-peach text-orange-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm z-10 border border-white/60 backdrop-blur-md">
            Premium
          </span>
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          to={`/products/${product._id}`}
          className="text-sm font-semibold text-slate-900 line-clamp-1 hover:text-primary"
        >
          {product.title}
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-base font-bold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="text-xs font-bold px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white hover:to-indigo-500 transition-all duration-300 shadow-md shadow-primary/20 hover:scale-105 active:scale-95"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

