import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Your cart</h1>
        <p className="text-xs text-slate-500">
          Your cart is empty. Explore our bedsheets and add your favourites.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover hover:-translate-y-0.5 transition-all"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">Your cart</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ₹{item.product.price.toLocaleString("en-IN")} per set
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="text-[11px] text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="inline-flex items-center border border-slate-200 rounded-full text-xs">
                    <button
                      className="px-2.5 py-1 text-slate-600"
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-slate-200 text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2.5 py-1 text-slate-600"
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    ₹
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4 bg-white border border-slate-100 rounded-2xl p-4 h-fit">
        <h2 className="text-sm font-semibold text-slate-900">
          Order summary
        </h2>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-100">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Cash on Delivery available on all orders.
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover hover:-translate-y-0.5 transition-all"
        >
          Continue to checkout
        </button>
      </aside>
    </div>
  );
};

export default CartPage;

