import { useEffect, useState } from "react";
import type { Order } from "../types";

const API_URL = "http://localhost:5000/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/orders/my`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">
        My orders
      </h1>
      {loading ? (
        <p className="text-xs text-slate-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-xs text-slate-500">
          You haven't placed any orders yet.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-slate-100 rounded-2xl p-4 text-xs space-y-2"
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
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Status:{" "}
                    <span className="capitalize">
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 space-y-1">
                <p className="font-medium text-slate-800">
                  Items
                </p>
                <ul className="space-y-1">
                  {order.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {(i.product as any).title || "Bedsheet"} x{" "}
                        {i.quantity}
                      </span>
                      <span>
                        ₹
                        {(
                          ((i.product as any).price || 0) *
                          i.quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-slate-100 pt-2">
                <p className="font-medium text-slate-800">
                  Delivery address
                </p>
                <p className="text-[11px] text-slate-600">
                  {order.address.fullName}, {order.address.phone}
                  <br />
                  {order.address.addressLine}
                  <br />
                  {order.address.city} - {order.address.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

