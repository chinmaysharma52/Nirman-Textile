import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { OrderAddress } from "../types";

const API_URL = "http://localhost:5000/api";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState<OrderAddress>({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Your cart is empty. Add some bedsheets before checking out.
      </p>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
          })),
          totalPrice: total,
          address,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to place order");
      }
      const data = await res.json();
      clearCart();
      
      if (data.emailSent) {
        alert(`Order placed successfully! A confirmation email has been sent to ${data.userEmail}`);
      } else {
        alert(`Order placed successfully! However, we could not send a confirmation email to ${data.userEmail}. Please ensure the admin's SMTP settings are configured properly.`);
      }
      
      navigate("/orders");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof OrderAddress,
    value: string
  ) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid lg:grid-cols-[1.4fr,1fr] gap-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-xl font-semibold text-slate-900">
          Delivery details
        </h1>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1 text-xs">
            <label className="font-medium text-slate-700">
              Full Name
            </label>
            <input
              required
              value={address.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1 text-xs">
            <label className="font-medium text-slate-700">
              Phone Number
            </label>
            <input
              required
              value={address.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <label className="font-medium text-slate-700">
            Address
          </label>
          <textarea
            required
            value={address.addressLine}
            onChange={(e) => handleChange("addressLine", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-slate-50 focus:bg-white transition-colors"
            rows={3}
            placeholder="House no., Building, Street, Area"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1 text-xs">
            <label className="font-medium text-slate-700">
              City
            </label>
            <input
              required
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1 text-xs">
            <label className="font-medium text-slate-700">
              Pincode
            </label>
            <input
              required
              value={address.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <h2 className="font-semibold text-slate-900">
            Payment method
          </h2>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-accent/30 bg-accent/5 px-4 py-3 shadow-sm">
            <div className="h-4 w-4 rounded-full border border-accent bg-accent flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Cash on Delivery (COD)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Pay in cash when your order is delivered.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent text-white text-sm font-bold shadow-lg shadow-accent/20 hover:bg-accent-hover hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="space-y-4 bg-white border border-slate-100 rounded-2xl p-4 h-fit">
        <h2 className="text-sm font-semibold text-slate-900">
          Order summary
        </h2>
        <div className="space-y-3 text-xs text-slate-600 max-h-64 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between gap-3"
            >
              <div>
                <p className="font-medium text-slate-800">
                  {item.product.title}
                </p>
                <p className="text-[11px]">
                  Qty {item.quantity} · ₹
                  {item.product.price.toLocaleString("en-IN")}
                </p>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                ₹
                {(item.product.price * item.quantity).toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            You will receive your order in 4–7 working days. Payment will
            be collected in cash at the time of delivery.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;

