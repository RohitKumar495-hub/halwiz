'use client';
import React, { useEffect, useState } from 'react';
import { BsCurrencyDollar } from "react-icons/bs";
import { IoBagRemoveOutline } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";
import { RiProductHuntFill } from "react-icons/ri";
import Link from 'next/link';
import AdminGuard from '../components/AdminGuard';
import axios from 'axios';
import BASE_URL from '@/config/axios';
import toast from 'react-hot-toast';

const Page = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    returned: "bg-blue-100 text-blue-700",
  };

  // ✅ Fetch orders and customers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return toast.error('You are not logged in');

        // Fetch Orders
        const ordersRes = await axios.get(`${BASE_URL}/auth/get-all-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }

        // Fetch Customers (✅ Include admins too)
        const usersRes = await axios.get(`${BASE_URL}/auth/all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (usersRes.data.success && Array.isArray(usersRes.data.data)) {
          setTotalCustomers(usersRes.data.data.length);
        } else {
          setTotalCustomers(0);
        }
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const data = [
    { name: 'Total Revenue', no: `₹${totalRevenue.toLocaleString()}`, icon: BsCurrencyDollar },
    { name: 'Total Orders', no: totalOrders.toString(), icon: IoBagRemoveOutline },
    { name: 'Total Customers', no: totalCustomers.toString(), icon: IoIosPeople },
    { name: 'Products Sold', no: 'N/A', icon: RiProductHuntFill },
  ];

  return (
    <AdminGuard>
      <div className="p-4 grid gap-10">
        {/* ✅ Stats Cards */}
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white lg:w-40 h-20 shadow rounded-md p-2">
              <h1>{item.name}</h1>
              <div className="flex font-semibold items-center justify-between">
                <p className="lg:text-xl text-base">{item.no}</p>
                {<item.icon size={30} />}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Recent Orders Table */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link href="order-list" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              <div className="overflow-hidden">
                <table className="w-full border-collapse table-auto text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="p-2">ORDER ID</th>
                      <th className="p-2 lg:block hidden">CUSTOMER</th>
                      <th className="p-2">AMOUNT</th>
                      <th className="p-2">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="p-2 break-words">#{order._id.slice(-6)}</td>
                        <td className="p-2 break-words lg:block hidden">{order.customerName}</td>
                        <td className="p-2 break-words">₹{order.totalPrice}</td>
                        <td className="p-2 break-words">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Placeholder for Top Selling Products */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Top Selling Products</h2>
              <Link href="product-list" className="text-sm text-blue-600">
                View all
              </Link>
            </div>
            <p className="text-gray-500 text-sm">Data coming soon...</p>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default Page;
