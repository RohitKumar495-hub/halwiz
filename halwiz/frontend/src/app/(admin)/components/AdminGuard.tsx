'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AdminGuardProps {
  children: React.ReactNode
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const admin = localStorage.getItem('isAdmin')
    if (admin === 'true') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
      toast.error("You don't have permission")
      router.push('/auth') // redirect to login page
    }
  }, [router])

  if (isAdmin === null) return <p className='text-center'>Loading...</p> // waiting for check
  if (!isAdmin) return null // already redirecting

  return <>{children}</> // render admin content
}

export default AdminGuard
