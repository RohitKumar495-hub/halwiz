'use client'
import React, { useState, useEffect } from 'react'
import { IoIosPeople } from 'react-icons/io'
import { IoSearchOutline } from 'react-icons/io5'
import AdminGuard from '../components/AdminGuard'
import axios from 'axios'
import BASE_URL from '@/config/axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Customer {
  _id: string
  userId: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return toast.error('❌ You are not logged in!')

      const res = await axios.get(`${BASE_URL}/auth/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.data.success && Array.isArray(res.data.data)) {
        setCustomers(res.data.data)
      } else {
        setCustomers([])
        toast.error(res.data.message || 'Failed to fetch users')
      }
    } catch (err: any) {
      setCustomers([])
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  // Make a user admin
// Make a user admin
const handleMakeAdmin = async (id: string, name: string) => {
  // Show toast confirmation
  const confirmToastId = toast.info(
    <div>
      <p>Are you sure you want to make <b>{name}</b> an admin?</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={async () => {
            toast.dismiss(confirmToastId) // close confirmation toast
            try {
              const token = localStorage.getItem('authToken')
              if (!token) return toast.error('❌ You are not logged in!')

              const res = await axios.put(`${BASE_URL}/auth/make-admin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
              })

              if (res.data.success) {
                toast.success(`✅ ${name} is now an admin!`) // success toast
                fetchCustomers() // refresh table
              } else {
                toast.error(res.data.message || 'Failed to make admin')
              }
            } catch (err: any) {
              toast.error(err.response?.data?.message || err.message)
            }
          }}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(confirmToastId)}
          className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition cursor-pointer"
        >
          No
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  )
}


  // Filtered customers
  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.userId?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) return <p className='p-4'>Loading customers...</p>

  return (
    <AdminGuard>
      <div className='p-4 grid gap-6'>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {/* Topbar */}
        <div className='grid grid-cols-4'>
          <div className='bg-white w-40 h-20 shadow rounded-md p-2'>
            <h1>Total Customers</h1>
            <div className='flex font-semibold items-center justify-between'>
              <p className='text-xl'>{customers.length}</p>
              <IoIosPeople size={30} />
            </div>
          </div>
        </div>

        {/* Searchbar */}
        <div className='bg-white p-2 rounded-md'>
          <div className='flex gap-4 w-full'>
            <div className='border border-gray-300 flex items-center p-1 gap-4 w-64 rounded-md'>
              <IoSearchOutline size={20} className='text-gray-300' />
              <input
                type="text"
                placeholder='Search customers...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className='rounded w-full outline-none'
              />
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Customer ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr key={customer._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{customer.userId}</td>
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                        {customer.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </td>
                    <td className="p-3">{customer.email}</td>
                    <td className="p-3 text-center">
                      {customer.isAdmin ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(customer._id, customer.name)}
                          className="bg-amber-300 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-amber-400 transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-center">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No matching customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <p className="text-gray-500">
              Showing {filteredCustomers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>

              <span className="px-3 py-1 border rounded bg-gray-200">{currentPage}</span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}

export default CustomerListPage
