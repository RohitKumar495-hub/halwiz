import Link from 'next/link'
import React from 'react'
import AdminGuard from '../components/AdminGuard'

const TopBar = () => {
    return (
        <AdminGuard>
            <div className="flex justify-between p-4 shadow bg-white rounded">
                <div>
                    <h1 className="font-semibold text-xl">DashBoard</h1>
                    <p>Welcome back! Here's what's happening with your snack business.</p>
                </div>
                <div className="flex gap-2 items-center">
                    <Link href='/auth' className="w-12 h-12 p-2 rounded-full border">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3reaXDsKdWDNfjVHf2xEh2qH-uYP3zG9QEw&s" alt="" />
                    </Link>
                    <p>Admin</p>
                </div>
            </div>
        </AdminGuard>
    )
}

export default TopBar