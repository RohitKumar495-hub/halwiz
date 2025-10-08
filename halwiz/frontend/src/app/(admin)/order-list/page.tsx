'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { IoBagRemoveOutline, IoSearchOutline } from 'react-icons/io5';
import AdminGuard from '../components/AdminGuard';
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '@/config/axios'; // ✅ centralized config

const OrdersPage = () => {
  // ===== States =====
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ===== Fetch Orders from Backend =====
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('Unauthorized access');
          return;
        }

        const res = await axios.get(`${BASE_URL}/auth/get-all-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          toast.error(res.data.message || 'Failed to fetch orders');
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast.error(error.response?.data?.message || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===== Dashboard Stats =====
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    return [
      { name: 'Total Revenue', no: `₹${totalRevenue}`, icon: BsCurrencyDollar },
      { name: 'Total Orders', no: totalOrders, icon: IoBagRemoveOutline },
    ];
  }, [orders]);

  // ===== Filtered Orders =====
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        const today = new Date();
        const orderDate = new Date(order.createdAt);
        if (dateFilter === '7') {
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'today') {
          return orderDate.toDateString() === today.toDateString();
        } else if (dateFilter === '30') {
          const monthAgo = new Date();
          monthAgo.setDate(today.getDate() - 30);
          return orderDate >= monthAgo;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===== Loading State =====
  if (loading) {
    return (
      <AdminGuard>
        <div className="p-10 text-center text-lg font-semibold">Loading orders...</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="p-4 grid gap-6">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white w-40 h-20 shadow rounded-md p-2 flex flex-col justify-between"
            >
              <h1 className="text-sm font-medium">{item.name}</h1>
              <div className="flex font-semibold items-center justify-between">
                <p className="text-xl">{item.no}</p>
                <item.icon size={25} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-2 flex items-center rounded-md">
          <div className="flex gap-4 w-full flex-wrap">
            <div className="border border-gray-300 flex items-center p-1 gap-2 w-64 rounded-md">
              <IoSearchOutline size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="rounded w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border border-gray-300 p-1 outline-none rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <select
              className="border border-gray-300 p-1 outline-none rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
                        {order.customerName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{order.customerName}</span>
                        <span className="text-gray-500 text-sm">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{order.totalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'returned'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{' '}
                {filteredOrders.length} orders
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
};

export default OrdersPage;
