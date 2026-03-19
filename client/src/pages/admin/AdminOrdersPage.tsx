import { useEffect, useState } from "react";
import type { Order } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const res = await fetch(`${API_URL}/admin/orders`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: string, status: "pending" | "delivered") => {
    await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    await loadOrders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary pb-2 border-b border-black/5">
        Orders management
      </h1>
      <div className="space-y-4 text-xs">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-black/5 rounded-3xl p-5 space-y-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-center gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  ₹{order.totalPrice.toLocaleString("en-IN")}
                </p>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value as "pending" | "delivered")
                  }
                  className="text-[11px] rounded-full border border-slate-200 px-2 py-1 bg-slate-50"
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-2 grid sm:grid-cols-2 gap-3">
              <div>
                <p className="font-medium text-slate-800 mb-1">
                  Customer
                </p>
                <p className="text-[11px] text-slate-600">
                  {(order as any).user?.name} –{" "}
                  {(order as any).user?.email}
                  <br />
                  {order.address.fullName}, {order.address.phone}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-800 mb-1">
                  Items
                </p>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      {(i.product as any).title || "Bedsheet"} x {i.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-2">
              <p className="font-medium text-slate-800 mb-1">
                Delivery address
              </p>
              <p className="text-[11px] text-slate-600">
                {order.address.addressLine}, {order.address.city} -{" "}
                {order.address.pincode}
              </p>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-xs text-slate-500">
            No orders yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;

